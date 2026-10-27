import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Seasons } from "../models/seasons.model.js";
import {Episodes} from "../models/episodes.model.js"
import uploadOnCloudinary from "../utils/cloudinary.js"
import { getPagination, paginationReturn } from "../utils/Pagination.js";

const addEpisodes = asyncHandler(async(req,res)=>{
    const {episode_no, title, description="", r_date, active= true} = req.body
    const {series_id, season_id} = req.params
    if(!episode_no || episode_no<=0)
    {
        throw new ApiError(404,"Episode number is required")
    }
    const season = await Seasons.findOne({
        _id: season_id,
        series_id: series_id
    })

    
    if (!season) {
        throw new ApiError(404, "Season does not belong to this series")
    }
        if(episode_no>season.total_episodes)
    {
        throw new ApiError(404,"Episodes must be less than total episodes")
    }
    if(!title || title.trim()==="")
    {
        throw new ApiError(404,"Title is required")
    }
    if(!r_date)
    {
        throw new ApiError(404,"Release date is required")
    }
    const videoFilePath = req.file?.path
    if(!videoFilePath)
    {
        throw new ApiError(404,"Video must required")
    }
    const video = await uploadOnCloudinary(videoFilePath)
    if(!video.url)
    {
        throw new ApiError(500, "Error in uploading video on server")
    }
    const exists = await Episodes.findOne({
        series_id,
        season_id,
        episode_no
    })
    
    if (exists) {
        throw new ApiError(409, "Episode number already exists")
    }
    const episode = await Episodes.create({
        series_id,
        season_id,
        episode_no,
        title,
        description,
        video: {
            hls_master_url: video.url,
            resolutions: {}
        },
        r_date,
        active
    })
    if(!episode)
    {
        throw new ApiError(404, "Error in creating episodes")
    }
    return res.status(200).json(
        new ApiResponse(200, episode, "Episode uploaded successfully")
    )
})

const updateEpisode = asyncHandler(async(req,res)=>{
    const {episode_no, title, description="", r_date, active= true} = req.body
    const {series_id, season_id, episode_id} = req.params    
    const episode = await Episodes.findById(episode_id)
    
    if(!episode)
    {
        throw new ApiError(404, "Episode not available")
    }
    if(!episode_no || episode_no<=0)
    {
        throw new ApiError(404,"Episode number is required")
    }
   
    const season = await Seasons.findOne({
        _id: season_id,
        series_id: series_id
    })
    
    if (!season) {
        throw new ApiError(404, "Season does not belong to this series")
    }
        if(episode_no>season.total_episodes)
    {
        throw new ApiError(404,"Episodes must be less than total episodes")
    }

    if(!title || title.trim()==="")
    {
        throw new ApiError(404,"Title is required")
    }
    if(!r_date)
    {
        throw new ApiError(404,"Release date is required")
    }
    const exists = await Episodes.findOne({
        season_id,
        episode_no,
        _id: { $ne: episode_id }
    })
    
    if(exists)
    {
        throw new ApiError(404, "Epsiode number already exists")
    }
    const updatedEpisode = await Episodes.findByIdAndUpdate(
        episode_id,
        {
          series_id,
          season_id,
          episode_no,
          title,
          description,
          r_date,
          ...(active !== undefined && { active })
        },
        { new: true, runValidators: true }
      )      
    
    return res.status(200).json(
        new ApiResponse(200, updatedEpisode, "Episode uploaded successfully")
    )
})

const updateVideo = asyncHandler(async(req,res)=>{
    const { episode_id } = req.params
    const videoPath = req.file?.path
    if(!videoPath)
    {
        throw new ApiError(404, "Video is required")
    }
    const video = await uploadOnCloudinary(videoPath)
    if(!video?.url) 
    {
        throw new ApiError(500, "Error in uploading the video")
    }
    const updatedEpisode = await Episodes.findByIdAndUpdate(
        episode_id,
        {
            video:{
                hls_master_url: video.url,
                resolution: {}
            }
        },
        {
            new : true
        }
    )
    if(!updatedEpisode)
    {
        throw new ApiError(500, "Error in updating the video")
    }
    return res.status(200).json(
        new ApiResponse(200, updatedEpisode, "Successfully updated video" )
    )

})

const getEpisodeDetail = asyncHandler(async(req,res)=>{
    const {episode_id} = req.params
    const episode = await Episodes.findById(episode_id)
    if(!episode)
    {
        throw new ApiError(404,"No such episodes")
    }
    return res.status(200).json( new ApiResponse(200, episode, "Episodes fetched successfully"))
})

const deleteEpisode = asyncHandler(async(req,res)=>{
    const {episode_id} = req.params
    const episode = await Episodes.findById(episode_id)
    episode.active = false
    await episode.save({validateBeforeSave: false})
    return res.status(200).json(
        new ApiResponse(200, episode, "Episode soft deleted")
    )
})

const hardDeleteEpisode = asyncHandler(async(req,res)=>{
    const {episode_id} = req.params
    const episode = await Episodes.findById(episode_id)
    if(!episode)
    {
        throw new ApiError(404, "No such episodes")
    }
    await Episodes.deleteOne({_id: episode_id})
    return res.status(200).json(
        new ApiResponse(200, {}, "Episodes hard deleted")
    )
})

const getAllEpisodes = asyncHandler(async(req ,res)=>{
    const {season_id} = req.params
    const {page, limit, skip} = getPagination(req)
    const episodes = await Episodes.find({season_id: season_id}).skip(skip).limit(limit)
    const total = await Episodes.countDocuments({season_id: season_id})
    if(episodes.length===0)
    {
        throw new ApiError(404, "No episode found")
    }
    return res.status(200).json(
        new ApiResponse(200, paginationReturn(episodes, total, page, limit), "Episodes fetched successfully")
    )
})
 
const getAllActiveEpisodes = asyncHandler(async(req,res)=>{
    const {season_id} = req.params
    const {page, limit, skip} = getPagination(req)
    const episodes = await Episodes.find({season_id: season_id, active: true}).skip(skip).limit(limit)
    const total = await Episodes.countDocuments({season_id: season_id, active: true})
    if(episodes.length===0)
    {
        throw new ApiError(404, "No episode found")
    }
    return res.status(200).json(
        new ApiResponse(200, paginationReturn(episodes, total, page, limit), "Episodes fetched successfully")
    )
})

const getAllActiveSeriesEpisodes = asyncHandler(async(req ,res)=>{
    const {series_id} = req.params
    const {page, limit, skip} = getPagination(req)
    const episodes = await Episodes.find({series_id: series_id, active:true}).skip(skip).limit(limit)
    const total = await Episodes.countDocuments({series_id: series_id, active:true})
    if(episodes.length===0)
    {
        throw new ApiError(404, "No episode found")
    }
    return res.status(200).json(
        new ApiResponse(200, paginationReturn(episodes, total, page, limit), "Episodes fetched successfully")
    )
})

export {getAllEpisodes,addEpisodes, updateEpisode, deleteEpisode, hardDeleteEpisode, getEpisodeDetail, getAllActiveEpisodes, getAllActiveSeriesEpisodes, updateVideo}