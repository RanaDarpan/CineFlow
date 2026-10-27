import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Profiles } from "../models/profiles.model.js";
import uploadonCloudinary from "../utils/cloudinary.js";
import { Genres } from "../models/genre.model.js";

const createProfile = asyncHandler(async (req, res) => {
    const user_id = req.user._id
    const { name, languages, maturity_rating, genre } = req.body

    if (!name || !maturity_rating) {
        throw new ApiError(400, "Name and maturity rating are required")
    }
 
    const validMaturity = ["All", "Kids", "13+", "16+", "18+"]
    if (!validMaturity.includes(maturity_rating)) {
        throw new ApiError(400, "Invalid maturity rating")
    }

    const avatarPath = req.file?.path

 
    const avatar = await uploadonCloudinary(avatarPath)

    let genreIds = []
    if (genre && genre.length > 0) {
        const geneA = Array.isArray(genre) ? genre : [genre];
        const genreArray = geneA.map((g)=>g.toLowerCase())

        const genreDocs = await Genres.find({
            name: { $in: genreArray },
            active: true
        }).select("_id");

        if (genreDocs.length !== genreArray.length) {
            throw new ApiError(400, "One or more genres are invalid");
        }

        genreIds = genreDocs.map(g => g._id)
    }

    const profile = await Profiles.create({
        user_id,
        name,
        avatar: avatar.url,
        settings: {
            languages: languages || "English",
            maturity_rating
        },
        genre: genreIds.length > 0 ? genreIds : []
    });

    return res.status(201).json(
        new ApiResponse(201, profile, "Profile created successfully")
    );
});

const getProfile = asyncHandler(async (req, res) => {
    return res.status(200).json(
        new ApiResponse(200, await req.profile.populate("genre", "name"), "Profile fetched successfully")
    );
});

const getAllUserProfiles = asyncHandler(async (req, res) => {
    const profiles = await Profiles.find({ user_id: req.user._id })
    return res.status(200).json(
        new ApiResponse(200, profiles, "Profiles fetched successfully")
    );
});

const deleteProfile = asyncHandler(async (req, res) => {
    await Profiles.deleteOne({_id: req.profile._id})
    return res.status(200).json(
        new ApiResponse(200, "Profile deleted successfully")
    );
});
 
const updateProfile = asyncHandler(async(req, res)=>{
    const {profile_id} = req.params
    const profile = await Profiles.findById(profile_id)
    if(!profile)
    {
        throw new ApiError(404, "No such profile")
    }
    const { name, languages="English", maturity_rating, genre } = req.body

    if (!name || !maturity_rating) {
        throw new ApiError(400, "Name and maturity rating are required")
    }
 
    const validMaturity = ["All", "Kids", "13+", "16+", "18+"]
    if (!validMaturity.includes(maturity_rating)) {
        throw new ApiError(400, "Invalid maturity rating")
    }

    let genreIds = []
    if (genre && genre.length > 0) {
        const geneA = Array.isArray(genre) ? genre : [genre];
        const genreArray = geneA.map((g)=>g.toLowerCase())
        console.log("GenreArray: ",genreArray)

        const genreDocs = await Genres.find({
            name: { $in: genreArray },
            active: true
        }).select("_id");

        console.log(genreDocs)

        if (genreDocs.length !== genreArray.length) {
            throw new ApiError(400, "One or more genres are invalid");
        }

        genreIds = genreDocs.map(g => g._id)
    }

    profile.name = name,
    profile.settings.languages = languages
    profile.settings.maturity_rating = maturity_rating
    profile.genre = genreIds
    await profile.save({})

    return res.status(201).json(
        new ApiResponse(201, profile, "Profile updated successfully")
    );
})

// const changeLanguage = asyncHandler(async (req, res) => {
//     const { language } = req.body;
//     if (!language) {
//         throw new ApiError(400, "Language is required");
//     }   
//     req.profile.settings.languages = language;
//     await req.profile.save({ validateBeforeSave: false });
//     return res.status(200).json(
//         new ApiResponse(200, req.profile, "Language updated successfully")
//     );
// });

// const changeMaturity = asyncHandler(async (req, res) => {
//     const { maturity_rating } = req.body;
//     const validMaturity = ["All", "Kids", "13+", "16+", "18+"];
//     if (!validMaturity.includes(maturity_rating)) {
//         throw new ApiError(400, "Invalid maturity rating");
//     }
//     req.profile.settings.maturity_rating = maturity_rating;
//     await req.profile.save({ validateBeforeSave: false });
//     return res.status(200).json(
//         new ApiResponse(200, req.profile, "Maturity updated successfully")
//     );
// });

const changeAvatar = asyncHandler(async (req, res) => {
    const avatarPath = req.file?.path;
    if (!avatarPath) {
        throw new ApiError(400, "Avatar file is required");
    }
    const avatar = await uploadonCloudinary(avatarPath);
    req.profile.avatar = avatar.url;
    await req.profile.save({ validateBeforeSave: false });
    return res.status(200).json(
        new ApiResponse(200, req.profile, "Avatar updated successfully")
    );
});

// const updateProfileName = asyncHandler(async (req, res) => {
//     const { name } = req.body;
//     if (!name || name.trim() === "") {
//         throw new ApiError(400, "Profile name is required");
//     }
//     req.profile.name = name;
//     await req.profile.save({ validateBeforeSave: false });
//     return res.status(200).json(
//         new ApiResponse(200, req.profile, "Profile name updated successfully")
//     );
// });

// const changeGenre = asyncHandler(async (req, res) => {
//     let { genre } = req.body;

//     if (!genre || (Array.isArray(genre) && genre.length === 0)) {
//         throw new ApiError(400, "At least one genre is required");
//     }

//     if (typeof genre === "string") genre = [genre];

//     const genreDocs = await Genres.find({
//         _id: { $in: genre },
//         active: true
//     }).select("_id");

//     if (genreDocs.length === 0) {
//         throw new ApiError(400, "No valid genres provided");
//     }

//     const genreIds = genreDocs.map(g => g._id);

//     req.profile.genre = genreIds;
//     await req.profile.save({ validateBeforeSave: false });

//     await req.profile.populate("genre", "name");

//     return res.status(200).json(
//         new ApiResponse(200, req.profile, "Genres updated successfully")
//     );
// });


export { createProfile, getProfile, getAllUserProfiles, deleteProfile, updateProfile,  changeAvatar};
