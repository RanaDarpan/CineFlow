import { Profiles } from "../models/profiles.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

export const profileCheck = asyncHandler(async (req, res, next) => {
    const {profile_id}  = req.params;
    const user_id = req.user._id;
    if (!profile_id) {
        throw new ApiError(400, "Profile ID is required");
    }  
    const profile = await Profiles.findById(profile_id);
    if (!profile) {
        throw new ApiError(404, "Profile not found");
    }
    if (req.user.email !== process.env.ADMIN_EMAIL) {
        if (profile.user_id.toString() !== user_id.toString()) {
            throw new ApiError(403, "Unauthorized profile access");
        }
    }
    req.profile = profile;
    next();
});

