import asyncHandler from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js"

export const verifySubscription = asyncHandler(async(req, res, next) => {
    next();
    // const user = req.user  
    // console.log(user.subscription)
    // const now = new Date()    
    // if((user.subscription.status === true && 
    //    user.subscription.e_date > now) || user.email === process.env.ADMIN_EMAIL) {
    //     console.log("Executed")
    //     next()  
    // } else {
    //     throw new ApiError(404, "Active subscription required to access this content")
    // }
})