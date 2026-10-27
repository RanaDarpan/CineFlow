import { Users } from "../models/users.model.js";
import ApiError from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";

export const verifyJWT = asyncHandler(async(req, res, next)=> 
{
   try {
     const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
     if(!token)
     {
         throw new ApiError(404, "Not Valid Request")
     }
     const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
     const user = await Users.findById(decodeToken?._id).select("-password -refreshToken")
     if(!user)
     {
         throw new ApiError(404,"Invalid Access Token")
     }
     else
     {
         req.user = user
         next()
     }
   } catch (error) {
    throw new ApiError(401, "Error in verifyJWT", error)
   }

})