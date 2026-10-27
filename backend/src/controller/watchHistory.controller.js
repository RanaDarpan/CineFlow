import asyncHandler from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import { WatchHistory } from "../models/watchHistory.model.js"
import { Episodes } from "../models/episodes.model.js"
import { getPagination, paginationReturn } from "../utils/Pagination.js"

const updateWatchHistory = asyncHandler(async(req,res)=>{
    const user = req.user
    const profile = req.profile
    const {content_type, content_id, progress_percentage=0} = req.body
    let series_id = null;
    let season_id = null;
    let episode_id = null
    
    if(!content_id)
    {
        throw new ApiError(404, "Content Id is required ")
    }
    if(!content_type)
    {
        throw new ApiError(404, "Content Type is required")
    }
    if (progress_percentage < 0 || progress_percentage > 100) {
        throw new ApiError(400, "Progress must be between 0 and 100")
    }
    if (!["Movies", "Episodes"].includes(content_type)) {
        throw new ApiError(400, "Invalid content type");
      }
      if(content_type === "Episodes")
        {
            const episode = await Episodes.findById(content_id)
            if(!episode)
            {
                throw new ApiError(404, "No such episode")
            }
            series_id = episode.series_id
            season_id = episode.season_id
            episode_id = episode._id
        }

        
    const watchHistory = await WatchHistory.findOneAndUpdate({
        user_id: user.id, profile_id: profile.id, content_type: content_type, content_id: content_id
    }, {
        series_id: series_id, 
        season_id: season_id ,
        episode_id: episode_id,
        progress_percentage,
        last_watched_at: new Date()
    }, {new: true, upsert: true, setDefaultsOnInsert: true})


    if(!watchHistory)
    {
        throw new ApiError(500, "Error in updating the watchHistory")
    }

    return res.status(200).json(
        new ApiResponse(200, watchHistory, "WatchHistory updated successfully")
    )

})

const getWatchHistory = asyncHandler(async(req,res)=> {
    const profile = req.profile
    const {page,limit,skip} = getPagination(req)
    const watchHistory = await WatchHistory.find({profile_id: profile._id, progress_percentage : {$lt: 95}})
    .skip(skip)
    .limit(limit)
    .sort({last_watched_at: -1})
    .populate({
        path: "content_id",
        select: "title thumbnail series_id",
        populate: {
            path: "series_id",
            model: "Series",
            select: "thumbnail",
            strictPopulate: false
        }
    })
    const total = await WatchHistory.countDocuments({profile_id: profile._id, progress_percentage : {$lt: 95}})
    if(watchHistory.length===0)
    {
        throw new ApiError(404, "No video watched")
    }
    return res.status(200).json(
        new ApiResponse(200, paginationReturn(watchHistory, page, limit, total), "Watch History fetched")
   )
})

const getWatchedWatchHistory = asyncHandler(async(req,res)=>{
    const profile = req.profile
    const {page,limit,skip} = getPagination(req)
    const watchHistory = await WatchHistory.find({profile_id: profile._id, progress_percentage: {$gte: 95}})
    .skip(skip)
    .limit(limit)
    .sort({last_watched_at: -1})
    .populate({
        path: "content_id",
        select: "title thumbnail series_id",
        populate: {
            path: "series_id",
            model: "Series",
            select: "thumbnail",
            strictPopulate: false
        }
    })
    const total = await WatchHistory.countDocuments({profile_id:profile._id, progress_percentage: {$gte: 95}})
    if(watchHistory.length===0)
    {
        throw new ApiError(404, "No movie/series finished")
    }
    return res.status(200).json(
        new ApiResponse(200, paginationReturn(watchHistory, page, limit, total), "Recently watched fetched")
    )
})

const getAllWatchHistory = asyncHandler(async(req,res)=> {
    const profile = req.profile
    const {page,limit,skip} = getPagination(req)
    const watchHistory = await WatchHistory.find({profile_id: profile._id})
    .skip(skip)
    .limit(limit)
    .sort({last_watched_at: -1})
    .populate({
        path: "content_id",
        select: "title thumbnail series_id",
        populate: {
            path: "series_id",
            model: "Series",
            select: "thumbnail",
            strictPopulate: false
        }
    })
    const total = await WatchHistory.countDocuments({profile_id:profile._id})
    if(watchHistory.length===0)
    {
        throw new ApiError(404, "No movie/series watched")
    }
    return res.status(200).json(
        new ApiResponse(200, paginationReturn(watchHistory, page, limit, total), "Watch History fetched")
    )
})

export {updateWatchHistory, getWatchHistory, getWatchedWatchHistory, getAllWatchHistory}