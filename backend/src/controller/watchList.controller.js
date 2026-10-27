import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { WatchList } from "../models/watchList.model.js";
import { getPagination, paginationReturn } from "../utils/Pagination.js";


const addToWatchList = asyncHandler(async(req,res)=>{
     const {content_type,content_id} = req.body
     const user = req.user
     const profile = req.profile

     if(!content_id || !content_type)
        {
           throw new ApiError(404, "Content Type or Id is missing")
        }
    
     const exist = await WatchList.findOne({
        user_id: user._id,
        profile_id: profile._id,
        content_id,
        content_type
      })
      
      if (exist) {
        throw new ApiError(409, "Already added to watchlist")
      }
      
 
     
     const watchList = await WatchList.create({
        user_id: user._id,
        profile_id: profile._id,
        content_type: content_type,
        content_id: content_id
     })
     res.status(200).json(
        new ApiResponse(200, watchList, "Added to watchlist")
     )
}) 

const removeFromWatchList = asyncHandler(async(req,res)=>{
    const {content_type, content_id} = req.body
    const exist = await WatchList.find({user_id: req.user._id, profile_id: req.profile._id,content_id: content_id, content_type: content_type})
    if(exist.length===0)
    {
        throw new ApiError(404, "Not in watchList")
    }
    const removeWatch = await WatchList.deleteOne({user_id: req.user._id, profile_id: req.profile._id, content_id:content_id, content_type: content_type})
    return res.status(200).json(
        new ApiResponse(200, {}, "Removed from watchlist")
    )
})

const getProfileWatchList = asyncHandler(async(req,res)=>{
    const {page,limit,skip} = getPagination(req)
    const profile = req.profile
    const watchList = await WatchList.find({profile_id: profile._id}).skip(skip).limit(limit).populate("content_id","title thumbnail")
    const total = await WatchList.countDocuments({profile_id: profile._id})
    if(watchList.length===0)
    {
        throw new ApiError(404, "No content in the watchList")
    }
    return res.status(200).json(
        new ApiResponse(200, paginationReturn(watchList, page, limit, total), "Watchlist fetched successfully")
    )
})

export {addToWatchList, removeFromWatchList, getProfileWatchList}