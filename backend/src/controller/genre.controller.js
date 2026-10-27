import { Genres } from "../models/genre.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { getPagination, paginationReturn } from "../utils/Pagination.js";

const addGenre = asyncHandler(async(req,res)=>
{
    const {name} = req.body
    if(!name || name.trim()==="")
    {
        throw new ApiError(404, "Genre name must be required")
    }
    const normalizedName = name.trim().toLowerCase();
    const existingGenre = await Genres.findOne({ name: normalizedName });
    if (existingGenre) {
        throw new ApiError(409, "Genre already exists");
    }
    const response = await Genres.create({
        name: normalizedName
    })
    return res.status(200).json(
        new ApiResponse(200,response,"Genre created successfully")
    )
})

const updateGenre = asyncHandler(async(req,res)=>
{
    const {genre_id} = req.params
    const name = req.body.name
    const active = req.body.active
    if (name && name.trim() !== "") {
        const duplicate = await Genres.findOne({
            name: name.trim().toLowerCase(),
            _id: { $ne: genre_id }
        });
        if (duplicate) {
            throw new ApiError(409, "Genre name already exists");
        }
    }
       
    const genre = await Genres.findById(genre_id)
    if(!genre)
    {
        throw new ApiError(404,"No such genre")
    }   
        genre.name = name.trim().toLowerCase();
    
    if (typeof active === "boolean") {
        genre.active = active;
    }
    await genre.save({validateBeforeSave: false})
    return res.status(200).json(
        new ApiResponse(200, genre, "Genre updated successfully")
    )
})

const deleteGenre = asyncHandler(async (req, res) => {
    const { genre_id } = req.params;
    const genre = await Genres.findById({_id:genre_id});
    if (!genre) {
        throw new ApiError(404, "Genre not found");
    }
    await Genres.deleteOne({_id:genre_id})
    return res.status(200).json(
        new ApiResponse(200, {}, "Genre deleted successfully")
    );
});

const getAllGenre = asyncHandler(async(req,res)=>{
    const {page,limit,skip} = getPagination(req)
    const response = await Genres.find().skip(skip).limit(limit)
    const total = await Genres.countDocuments()
    return res.status(200).json(
        new ApiResponse(200, paginationReturn(response, page, limit, total), "Genre fetched successfully")
    )
})

const getAllActiveGenre = asyncHandler(async(req,res)=>{
    const {page,limit,skip} = getPagination(req)
    const response = await Genres.find({active:true}).skip(skip).limit(limit)
    const total = await Genres.countDocuments({active: true})
    return res.status(200).json(
        new ApiResponse(200, paginationReturn(response, page, limit, total), "Genre fetched successfully")
    )
})


const getGenre = asyncHandler(async(req,res)=>
{
    const {genre_id} = req.params
    const genre = await Genres.findById(genre_id)
    if(genre.active===false)
    {
        throw new ApiError(404, "No such genre")
    }
    return res.status(200).json(
        new ApiResponse(200,genre.name,"Genre found successfully")
    )
})


export {addGenre, updateGenre, deleteGenre, getAllGenre, getGenre, getAllActiveGenre}