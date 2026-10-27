import { Movies } from "../models/movies.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import { Genres } from "../models/genre.model.js";
import { getPagination, paginationReturn } from "../utils/Pagination.js";

const addMovie = asyncHandler(async (req, res) => {
    let {
        title,
        description = "",
        genres,
        r_date,
        age_rating = "All",
        rating = 0,
    } = req.body;
    let active = req.body.active === "true" || req.body.active === true;

    if (!title || !title.trim()) throw new ApiError(400, "Title is required");
    if (!genres)
        throw new ApiError(400, "At least one genre is required");
    if (!r_date) throw new ApiError(400, "Release date is required");
    const validRatings = ["All", "Kids", "13+", "16+", "18+"];
    if (!validRatings.includes(age_rating))
        throw new ApiError(
            400,
            "Age rating must be one of: All, Kids, 13+, 16+, 18+"
        );

    if (rating == null || rating < 0 || rating > 10)
        throw new ApiError(400, "Rating must be between 0 and 10");

    const thumbnailPath = req.files?.thumbnail?.[0]?.path;
   
    const videoPath = req.files?.video?.[0]?.path;


    if (!thumbnailPath) throw new ApiError(400, "Thumbnail is required");
    if (!videoPath) throw new ApiError(400, "Video file is required");
    const thumbnail = await uploadOnCloudinary(thumbnailPath);
    const video = await uploadOnCloudinary(videoPath);
  
    if (!thumbnail?.url || !video?.url)
        throw new ApiError(500, "Error uploading media files");

    let genreIds = []
    if (genres && genres.length > 0) {
        // Normalize genres from either "horror, comedy" or ["horror", " comedy"]
        const genreArray = (Array.isArray(genres) ? genres : [genres])
            .flatMap((g) => g.split(","))
            .map((g) => g.trim().toLowerCase())
            .filter(Boolean);

        const genreDocs = await Genres.find({
            _id: { $in: genreArray },
            active: true
        }).select("_id");

   
        if (genreDocs.length !== genreArray.length) {
            throw new ApiError(400, "One or more genres are invalid");
        }
 
        genreIds = genreDocs.map(g => g._id)
    }

    r_date = new Date(r_date)
    const movie = await Movies.create({
        title: title.trim(),
        description: description.trim(),
        thumbnail: thumbnail.url,
        video: {
            hls_master_url: video.url,
            resolutions: {},
        },
        genres: genreIds,
        r_date,
        age_rating,
        rating,
        active,
    });

    return res
        .status(201)
        .json(new ApiResponse(201, movie, "Movie added successfully"));
});

const getMovieDetails = asyncHandler(async (req, res) => {
    const { movie_id } = req.params;
    const movie = await Movies.find({
        _id: movie_id,
        active: true,
    });
    if (!movie) {
        throw new ApiError(404, "Movie not found");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, movie, "Movie Data Fetched"));
});

const deleteMovie = asyncHandler(async (req, res) => {
    const { movie_id } = req.params;
    const movie = await Movies.findById(movie_id);
    if (!movie) {
        throw new ApiError(404, "Movie not found");
    }
    movie.active = false;
    await movie.save({ validateBeforeSave: false });
    return res
        .status(200)
        .json(new ApiResponse(200, movie, "Movie deleted successfully"));
});

const updateMovieDetails = asyncHandler(async (req, res) => {
    const { movie_id } = req.params;
    const movie = await Movies.findById(movie_id).select();
    if (!movie) { 
        throw new ApiError(404, "Movie not found");
    }
    let {
        title,
        description = "",
        genres,
        r_date,
        age_rating = "All",
        rating = 0,
    } = req.body;
    let active = req.body.active === "true" || req.body.active === true;
    if (!title || !title.trim()) throw new ApiError(400, "Title is required");
    if (!genres || !Array.isArray(genres) || genres.length === 0)
        throw new ApiError(400, "At least one genre is required");
    if (!r_date) throw new ApiError(400, "Release date is required");
    const validRatings = ["All", "Kids", "13+", "16+", "18+"];
    if (!validRatings.includes(age_rating))
        throw new ApiError(
            400,
            "Age rating must be one of: All, Kids, 13+, 16+, 18+"
        );
    if (rating == null || rating < 0 || rating > 10)
        throw new ApiError(400, "Rating must be between 0 and 10");
 
    let genreIds = []
    if (genres && genres.length > 0) {
        const genreArray = (Array.isArray(genres) ? genres : [genres])
            .flatMap((g) => g.split(","))
            .map((g) => g.trim().toLowerCase())
            .filter(Boolean);

        const genreDocs = await Genres.find({
            _id: { $in: genreArray },
            active: true
        }).select("_id");

   
        console.log(genreDocs)
        if (genreDocs.length !== genreArray.length) {
            throw new ApiError(400, "One or more genres are invalid");
        }
 
        genreIds = genreDocs.map(g => g._id)
    }

    r_date = new Date(r_date)

    await Movies.updateOne(
        { _id: movie_id },
        {
            $set: {
                title,
                description,
                genres: genreIds,
                r_date,
                age_rating,
                rating,
                active,
            },
        }
    );
    const updatedMovie = await Movies.findById(movie_id).select();

    return res
        .status(200)
        .json(
            new ApiResponse(200, updatedMovie, "Movie details updated successfully")
        );
});

const updateThumbnail = asyncHandler(async (req, res) => {
    const { movie_id } = req.params;

    const thumbnailPath = req.file?.path;
    if (!thumbnailPath) throw new ApiError(400, "Thumbnail is required");

    const thumbnail = await uploadOnCloudinary(thumbnailPath);
    if (!thumbnail?.url) throw new ApiError(500, "Thumbnail upload failed");

    const updatedMovie = await Movies.findByIdAndUpdate(
        movie_id,
        { thumbnail: thumbnail.url },
        { new: true }
    );
 
    if (!updatedMovie) throw new ApiError(404, "Movie not found");

    return res
        .status(200)
        .json(new ApiResponse(200, updatedMovie, "Thumbnail updated successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
    const { movie_id } = req.params;

    const videoPath = req.file?.path;
    if (!videoPath) throw new ApiError(400, "Video is required");

    const video = await uploadOnCloudinary(videoPath);
    if (!video?.url) throw new ApiError(500, "Video upload failed");

    const updatedMovie = await Movies.findByIdAndUpdate(
        movie_id,
        {
            video: {
                hls_master_url: video.url,
                resolutions: {},
            },
        },
        { new: true }
    );

    if (!updatedMovie) throw new ApiError(404, "Movie not found");

    return res
        .status(200)
        .json(new ApiResponse(200, updatedMovie, "Video updated successfully"));
});

const getAllMovies = asyncHandler(async (req, res) => {
    const { page, limit, skip } = getPagination(req);
    const total = await Movies.countDocuments();
    const response = await Movies.find().skip(skip).limit(limit);
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                paginationReturn(response, total, page, limit),
                "Movies Fetched Successfully"
            )
        );
});

const getAllActiveMovies = asyncHandler(async (req, res) => {
    const { page, limit, skip } = getPagination(req);
    const total = await Movies.countDocuments({ active: true });
    const response = await Movies.find({ active: true }).skip(skip).limit(limit);
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                paginationReturn(response, page, limit, total),
                "Movies Fetched Successfully"
            )
        );
});

const getProfileMovies = asyncHandler(async (req, res) => {
    const profileGenres = req.profile.genre; 
    const profileMaturity = req.profile.settings.maturity_rating;
    const { page, limit, skip } = getPagination(req);
    const AGE_RANK = {
        Kids: 0,
        All: 0,
        "13+": 13,
        "16+": 16,
        "18+": 18,
    };

    const allowedAge = AGE_RANK[profileMaturity];
    if (allowedAge === undefined) {
        throw new ApiError(400, "Invalid profile maturity rating");
    }
    
    let query = {
        active: true,
    };

    
    if (profileMaturity !== "All") {
        query.age_rating = {
            $in: Object.keys(AGE_RANK).filter(
                (rating) => AGE_RANK[rating] <= allowedAge
            ),
        };
    }

    if (profileGenres && Array.isArray(profileGenres) && profileGenres.length > 0) {
        const genreIds = profileGenres.map(genre => genre._id || genre);
        query.genres = { $in: genreIds };
    }

    const movies = await Movies.find(query)
        .skip(skip)
        .limit(limit)
        .populate("genres", "name");

    const total = await Movies.countDocuments(query)
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                paginationReturn(movies, total, page, limit),
                "Profile movies fetched successfully"
            )
        );
});
//
export {
    addMovie,
    getMovieDetails,
    deleteMovie,
    updateMovieDetails,
    updateThumbnail,
    updateVideo,
    getAllActiveMovies,
    getAllMovies,
    getProfileMovies,
};
