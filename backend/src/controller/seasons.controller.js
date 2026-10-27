import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Seasons } from "../models/seasons.model.js";
import { Series } from "../models/series.model.js";
import { getPagination, paginationReturn } from "../utils/Pagination.js";

const addSeason = asyncHandler(async(req,res)=> {
    const {series_id} = req.params
    const series = await Series.findById(series_id)
    if(!series)
    {
        throw new ApiError(404, "No such series")
    }
    const {season_number, description = "", total_episodes, active= true} = req.body
    if(!season_number || season_number<=0)
    {
        throw new ApiError(404, "Valid season number must be passed")
    }
    if(!total_episodes || total_episodes<=0)
    {
        throw new ApiError(404, "Total Episodes must be valid")
    }

    const exists = await Seasons.findOne({ series_id, season_number });
    if (exists) {
        throw new ApiError(409, "Season already exists for this series");
    }

    const season = await Seasons.create({
        series_id,
        season_number,
        description,
        total_episode: total_episodes,
        active
    })

    return res.status(200).json(
        new ApiResponse(200, season, "Season created successfully")
    )
})

const updateSeason = asyncHandler(async(req,res)=>{
    const {series_id, season_id} = req.params
    const series = await Series.findById(series_id)
    if(!series)
    {
        throw new ApiError(404, "No such series")
    }
    const {season_number, description = "", total_episodes, active = true} = req.body
    if(!season_number || season_number<=0)
    {
        throw new ApiError(404, "Valid season number must be passed")
    }
    if(!total_episodes || total_episodes<=0)
    {
        throw new ApiError(404, "Total Episodes must be valid")
    }
    const season = await Seasons.findOne({ _id: season_id, series_id });
    if (!season) {
        throw new ApiError(404, "Season not found for this series");
    }

    const exists = await Seasons.findOne({ 
        series_id, 
        season_number,
        _id: { $ne: season_id }
    });
    if (exists) {
        throw new ApiError(404, "Season number already exists for this series");
    }

    const updateData = {
        series_id,
        season_number,
        description,
        total_episode: total_episodes,
    };

    if (active !== undefined) {
        updateData.active = active === true || active === "true";
    }

    const updatedSeason = await Seasons.findByIdAndUpdate(
        {
            _id: season_id,
        },
        updateData,
        {
            new: true
        }
    );
    if (!updatedSeason) {
        throw new ApiError(404, "Season not found");
    }

    return res.status(200).json(
        new ApiResponse(200, updatedSeason, "Season updated successfully")
    )
})

const deleteSeason = asyncHandler(async(req,res)=>{
    const {series_id, season_id} = req.params
    const series = await Series.findById(series_id)
    if(!series)
    {
        throw new ApiError(404, "No such series")
    }
    const season = await Seasons.findById(season_id)
    if (!season) {
        throw new ApiError(404, "Season not found");
    }    
    season.active = false
    await season.save({validateBeforeSave: false})
    return res.status(200).json( new ApiResponse(200, season, "Season deleted successfully"))
})

const getAllActiveSeasons = asyncHandler(async(req,res)=>{
    const {page, limit, skip} = getPagination(req)
    const {series_id} = req.params
    const series = await Series.findById(series_id)
    if(!series)
    {
        throw new ApiError(404, "No such series")
    }
    const seasons = await Seasons.find({series_id: series_id, active: true}).skip(skip).limit(limit)
    console.log("getAllActiveSeasons -> fetched seasons:", seasons)
    const total = await Seasons.countDocuments({series_id: series_id, active: true})


    return res.status(200).json(
        new ApiResponse(200, paginationReturn(seasons, page, limit, total), "All seasons fetched for series")
    )
})

const getAllSeasons = asyncHandler(async(req,res)=>{
    const {page, limit, skip} = getPagination(req)
    const {series_id} = req.params
    const series = await Series.findById(series_id)
    if(!series)
    {
        throw new ApiError(404, "No such series")
    }
    const seasons = await Seasons.find({series_id: series_id}).skip(skip).limit(limit)
    const total = await Seasons.countDocuments({series_id: series_id})

    return res.status(200).json(
        new ApiResponse(200, paginationReturn(seasons, page, limit, total), "All seasons fetched for series")
    )
})
 
const getSeason = asyncHandler(async(req,res)=> {
    const {series_id,season_id} = req.params
    const series = await Series.findById(series_id)
    if(!series)
    {
        throw new ApiError(404, "No such series")
    }
    const seasons = await Seasons.findOne({_id: season_id, series_id})
    if(!seasons)
    {
        throw new ApiError(404, "No season found")
    }
    return res.status(200).json(
        new ApiResponse(200, seasons, "Season fetched successfully")
    )

})

const searchSeason = asyncHandler(async(req,res)=>{
        const { search } = req.query;
        const { page, limit, skip } = getPagination(req);
    
        if (!search || !search.trim()) {
            throw new ApiError(400, "Search query is required");
        }
    
        const query = {
            active: true,
            $or: [
                { season_number: Number(search) || -1  },
                { description: { $regex: search, $options: "i" } },
            ],
        };
    
        const season = await Seasons.find(query)
            .skip(skip)
            .limit(limit)
        
        if (season.length === 0) {
                throw new ApiError(404, "No seasons found");
            }
            
    
        const total = await Seasons.countDocuments(query);
    
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    paginationReturn(season, total, page, limit),
                    "Season fetched successfully"
                )
            );
})

export {addSeason, deleteSeason, updateSeason, getAllActiveSeasons, getAllSeasons, getSeason, searchSeason}
