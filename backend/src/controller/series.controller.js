import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Series } from "../models/series.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import { Genres } from "../models/genre.model.js";
import { getPagination, paginationReturn } from "../utils/Pagination.js";
import mongoose from "mongoose";

const createSeries = asyncHandler(async (req, res) => {
    let {
        title,
        description = "",
        genres,
        r_date,
        age_rating, 
        total_seasons,
        rating,
        active = true,
    } = req.body;

    if (!title || !title.trim()) throw new ApiError(400, "Title is required");
    if (!genres)
        throw new ApiError(400, "At least one genre is required");

    const thumbnailPath = req.file?.path;

    if (!thumbnailPath) {
        throw new ApiError(400, "Thumbnail is required");
    }

    const thumbnail = await uploadOnCloudinary(thumbnailPath);
    if (!r_date) throw new ApiError(400, "Release date is required");

    const validRatings = ["All", "Kids", "13+", "16+", "18+"];
    if (!validRatings.includes(age_rating))
        throw new ApiError(
            400,
            "Age rating must be one of: All, Kids, 13+, 16+, 18+"
        );

    if (total_seasons === undefined || total_seasons === null || total_seasons < 0)
        throw new ApiError(400, "Total Seasons is required and cannot be negative");
    if (rating == null || rating < 0 || rating > 10)
        throw new ApiError(400, "Rating must be between 0 and 10");

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

    const series = await Series.create({
        title: title.trim(),
        description: description.trim(),
        thumbnail: thumbnail.url,
        genres: genreIds,
        r_date: r_date,
        age_rating: age_rating,
        total_seasons: total_seasons,
        rating: rating,
        active: active,
    });

    if (total_seasons > 0) {
        const { Seasons } = await import("../models/seasons.model.js");
        const seasons = [];
        for (let i = 1; i <= total_seasons; i++) {
            seasons.push({
                series_id: series._id,
                season_number: i,
                description: `Season ${i}`,
                total_episode: 0,
                active: true
            });
        }
        await Seasons.insertMany(seasons);
    }

    return res
        .status(200)
        .json(new ApiResponse(200, series, "Series created successfully"));
});

const updateSeries = asyncHandler(async (req, res) => {
    const { series_id } = req.params;
    const series = await Series.findById(series_id).select();
    if (!series) {
        throw new ApiError(404, "Series not found");
    }
    let {
        title,
        description = "",
        genres,
        r_date,
        age_rating,
        total_seasons,
        rating,
        active = series.active,
    } = req.body;

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

    if (total_seasons === undefined || total_seasons === null || total_seasons < 0)
        throw new ApiError(400, "Total Seasons is required and cannot be negative");
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

   
        if (genreDocs.length !== genreArray.length) {
            throw new ApiError(400, "One or more genres are invalid");
        }
 
        genreIds = genreDocs.map(g => g._id)
    }

    r_date = new Date(r_date)

    const updateData = {
       
    };

        if (active !== undefined) {
            // Convert string "true"/"false" to boolean
            updateData.active = active === true || active === "true";
        }

        await Series.updateOne(
            { _id: series_id },
            { $set: {
                title,
                description,
                genres: genreIds,
                r_date,
                age_rating,
                total_seasons,
                rating,
                active: active === true || active === "true",   
             }}
        );
        const updatedSeries = await Series.findById(series_id).select();

        if (!updatedSeries) {
            throw new ApiError(404, "Series not found");
        }

    return res
        .status(200)
        .json(new ApiResponse(200, updatedSeries, "Series updated successfully"));
});
 
const deleteSeries = asyncHandler(async (req, res) => {
    const { series_id } = req.params;
    const series = await Series.findById(series_id);
    if (!series) {
        throw new ApiError(404, "Series not found");
    }
    await Series.deleteOne({ _id: series_id });
    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Series deleted successfully"));
});

const updateThumbnail = asyncHandler(async (req, res) => {
    const { series_id } = req.params;
    const series = await Series.findById(series_id);
    if (!series) {
        throw new ApiError(404, "Series not found");
    }
    const thumbnailPath = req.file?.path;

    if (!thumbnailPath) {
        throw new ApiError(400, "Thumbnail is required");
    }

    const thumbnail = await uploadOnCloudinary(thumbnailPath);

    const updatedSeries = await Series.findByIdAndUpdate(
        series_id,
        { thumbnail: thumbnail.url },
        { new: true }
    );

    if (!updatedSeries) throw new ApiError(404, "Series not found");

    return res
        .status(200)
        .json(
            new ApiResponse(200, updatedSeries, "Thumbnail updated successfully")
        );
});

const getAllSeries = asyncHandler(async (req, res) => {
    const { page, limit, skip } = getPagination(req);
    const isAdmin = req.user && req.user.type === true;
    
    const query = {};
    if (!isAdmin) {
        query.total_seasons = { $gt: 0 };
    }

    const total = await Series.countDocuments(query);
    const series = await Series.find(query).skip(skip).limit(limit);
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                paginationReturn(series, page, limit, total),
                "Series fetched  successfully"
            )
        );
});

const getAllActiveSeries = asyncHandler(async (req, res) => {
    const { page, limit, skip } = getPagination(req);
    const isAdmin = req.user && req.user.type === true;
    
    const query = { active: true };
    if (!isAdmin) {
        query.total_seasons = { $gt: 0 };
    }

    const total = await Series.countDocuments(query);
    const series = await Series.find(query).skip(skip).limit(limit);
    return res
        .status(200)
        .json(
           new ApiResponse(200, paginationReturn(series, page, limit, total),"Active Series fetched")
        );
});

const getSeriesDetails = asyncHandler(async (req, res) => {
    const { series_id } = req.params;
    const series = await Series.findById(series_id);
    if (!series) {
        throw new ApiError(404, "No such series");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, series, "Series details fetched successfully"));
});

const getProfileSeries = asyncHandler(async (req, res) => {
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

    const isAdmin = req.user && req.user.type === true;
    if (!isAdmin) {
        query.total_seasons = { $gt: 0 };
    }

  
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

    const series = await Series.find(query)
        .skip(skip)
        .limit(limit)
        .populate("genres", "name");


    const total = await Series.countDocuments(query);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                paginationReturn(series, page, limit, total),
                "Profile series fetched successfully"
            )
        );
});

const searchSeries = asyncHandler(async (req, res) => {
    const { search } = req.query;
    const { page, limit, skip } = getPagination(req);

    if (!search || !search.trim()) {
        throw new ApiError(400, "Search query is required");
    }

    const isAdmin = req.user && req.user.type === true;

    const query = {
        active: true,
        $or: [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
        ],
    };

    if (!isAdmin) {
        query.total_seasons = { $gt: 0 };
    }

    const series = await Series.find(query)
        .skip(skip)
        .limit(limit)
        .populate("genres", "name");


    const total = await Series.countDocuments(query);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                paginationReturn(series, page, limit, total),
                "Series fetched successfully"
            )
        );
});

export {
    createSeries,
    deleteSeries,
    updateSeries,
    getAllActiveSeries,
    getSeriesDetails,
    getAllSeries,
    getProfileSeries,
    searchSeries,
    updateThumbnail,
};
