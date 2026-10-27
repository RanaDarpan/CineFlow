import { createProfile, getProfile, getAllUserProfiles, deleteProfile, changeAvatar,  updateProfile } from "../controller/profile.controller.js"
import { Router } from "express"
import { verifyJWT } from "../middleware/auth.middleware.js"
import { upload } from "../middleware/multer.middleware.js"
import {profileCheck} from "../middleware/profile.middleware.js"

const router = Router()
   
router.route("/get-all-profile").get(verifyJWT, getAllUserProfiles)
router.route("/create-profile").post(verifyJWT,upload.single("avatar"),createProfile)
router.delete("/delete-profile/:profile_id", verifyJWT, profileCheck,deleteProfile);
router.patch("/update-profile/:profile_id", verifyJWT, profileCheck, updateProfile)
router.patch("/update-avatar/:profile_id", verifyJWT, profileCheck,upload.single("avatar"), changeAvatar);
// router.patch("/:profile_id/name", verifyJWT, profileCheck, updateProfileName);
// router.patch("/:profile_id/language", verifyJWT, profileCheck, changeLanguage);
// router.patch("/:profile_id/maturity", verifyJWT, profileCheck, changeMaturity);
// router.patch("/:profile_id/change-genre", verifyJWT, profileCheck, changeGenre)
router.get("/:profile_id", verifyJWT, profileCheck, getProfile);

 
export default router