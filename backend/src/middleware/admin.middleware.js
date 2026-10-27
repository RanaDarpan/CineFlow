import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { verify } from "crypto";

export const verifyAdmin = asyncHandler(async(req,res,next)=>{
    if(req.user.type !== true && process.env.ADMIN_EMAIL !== req.user.email)
    {
        throw new ApiError(403,"Not authorized access")
    }
    next()
})