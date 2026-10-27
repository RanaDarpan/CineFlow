import { updateWatchHistory, getWatchedWatchHistory, getWatchHistory, getAllWatchHistory } from "../controller/watchHistory.controller.js";
import { Router } from "express"
import { verifyJWT } from "../middleware/auth.middleware.js"
import {profileCheck } from "../middleware/profile.middleware.js"
import { verifySubscription } from "../middleware/subscription.middleware.js"

const router = Router({mergeParams: true})
router.patch("/update-watch-History", verifyJWT, verifySubscription, profileCheck, updateWatchHistory)
router.get("/continue", verifyJWT,verifySubscription,profileCheck, getWatchHistory)
router.get("/watched",verifyJWT,verifySubscription,profileCheck,getWatchedWatchHistory)
router.get("/all",verifyJWT,verifySubscription,profileCheck,getAllWatchHistory)

export default router 