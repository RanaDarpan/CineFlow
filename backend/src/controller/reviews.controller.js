import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import { Reviews } from "../models/reviews.model.js";
import { getPagination, paginationReturn } from "../utils/Pagination.js";
import { Profiles } from "../models/profiles.model.js";

const addReview = asyncHandler(async(req,res)=>{
    const user = req.user
    const profile = req.profile
    const {content_type, content_id, rating, comment} = req.body
    if(!content_type || !content_id)
    {
        throw new ApiError(404,"Content type or Content Id is required")
    }
    if(!["Movies", "Series"].includes(content_type))
    {
        throw new ApiError(404, "Content type must be Movies or Series")
    }
    if(rating === undefined || rating === null)
    {
        throw new ApiError(404, "Rating is required")
    }
    if(rating<0 || rating>10)
    {
        throw new ApiError(404, "Rating must be between 0 to 10")
    }
    if(!comment?.trim())
    {
        throw new ApiError(404, "Comment is required")
    }
    const create = await Reviews.create({
        user_id: user._id,
        profile_id: profile._id,
        content_type,
        content_id,
        rating,
        comment
    })
    return res.status(200).json(
        new ApiResponse(200, create, "Review created successfully")
    )
})

const updateReview = asyncHandler(async(req,res)=>{
    const {review_id} = req.params
    const {content_type, content_id, rating, comment} = req.body
    const review = await Reviews.findById(review_id);

    if (!review) {
        throw new ApiError(404, "No review found");
    }

    if (review.user_id.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Not authorized to modify this review");
    }

    
    if(!review)
    {
        throw new ApiError(404,"No review found")
    }
    if(!content_type || !content_id)
    {
        throw new ApiError(404,"Content type or Content Id is required")
    }
    if(!["Movies", "Series"].includes(content_type))
    {
        throw new ApiError(404, "Content type must be Movies or Series")
    }
    if(rating === undefined || rating === null)
    {
        throw new ApiError(404, "Rating is required")
    }
    if(rating<0 || rating>10)
    {
        throw new ApiError(404, "Rating must be between 0 to 10")
    }
    if(!comment)
    {
        throw new ApiError(404, "Comment is required")
    }
    const create = await Reviews.findByIdAndUpdate(review_id,{
        content_type,
        content_id,
        rating,
        comment
    }, 
    {
        new: true
    })
    if(!create)
    {
        throw new ApiError(500, "Some error occured while reviewing")
    }
    return res.status(200).json(
        new ApiResponse(200, create, "Review created successfully")
    )
})

const deleteReview = asyncHandler(async(req,res)=>{
    const {review_id} = req.params
    const review = await Reviews.findById(review_id)
    if(!review)
    {
        throw new ApiError(404, "No review found")
    }
    await Reviews.deleteOne({_id: review_id})
    return res.status(200).json(
        new ApiResponse(200, {}, "Review deleted Successfully")
    )
})  

const getContentReview = asyncHandler(async (req, res) => {
    const { content_type, content_id } = req.params;
    const { page, limit, skip } = getPagination(req);

    const reviews = await Reviews.find({
        content_type,
        content_id
    })
    .skip(skip)
    .limit(limit)
    .populate("profile_id", "name avatar") // ✅ CORRECT
    .sort({ createdAt: -1 });

    const total = await Reviews.countDocuments({ content_type, content_id });

    if (reviews.length === 0) {
        return res.status(200).json(
            new ApiResponse(200, paginationReturn([], page, limit, total), "No reviews found")
        );
    }

    // 🔥 reshape response for frontend sanity
    const formatted = reviews.map(r => ({
        _id: r._id,
        rating: r.rating,
        comment: r.comment,
        createdAt: r.createdAt,
        profile: r.profile_id ? {
            _id: r.profile_id._id,
            name: r.profile_id.name,
            avatar: r.profile_id.avatar
        } : {
            _id: "anonymous",
            name: "Anonymous",
            avatar: null
        }
    }));

    return res.status(200).json(
        new ApiResponse(
            200,
            paginationReturn(formatted, total, page, limit),
            "Reviews fetched successfully"
        )
    );
});


const getProfileReview = asyncHandler(async(req,res)=>{
    const profile = req.profile
    const {page,limit,skip} = getPagination(req)
    const reviews = await Reviews.find({profile_id: profile._id})
        .skip(skip)
        .limit(limit)
        .populate("content_id", "title")
        .sort({createdAt: -1})
    console.log("Populated Reviews:", JSON.stringify(reviews, null, 2));
    const total = await Reviews.countDocuments({profile_id: profile._id})
    if(reviews.length===0)
    {
        throw new ApiError(404, "No review found")
    }
    return res.status(200).json(
        new ApiResponse(200, paginationReturn(reviews, total, page, limit), "Profile Reviews fetched")
    )
})   

const allReviews = asyncHandler(async(req,res)=>{
    const {page,limit,skip} = getPagination(req)
    const reviews = await Reviews.find().skip(skip).limit(limit)
    const total = await Reviews.countDocuments()
    if(reviews.length===0)
    {
        throw new ApiError(404, "No reviews yet")
    }
    return res.status(200).json(
        new ApiResponse(200, paginationReturn(reviews, page, limit, total), "Reviews fetched successfully")
    )
})

export {addReview, deleteReview, updateReview, getContentReview, getProfileReview, allReviews}