import {addToWatchList, removeFromWatchList, getProfileWatchList} from "../controller/watchList.controller.js"
import { Router } from "express"
import { verifyJWT } from "../middleware/auth.middleware.js"
import { verifyAdmin } from "../middleware/admin.middleware.js"
import { verifySubscription } from "../middleware/subscription.middleware.js"
import { profileCheck } from "../middleware/profile.middleware.js"

const router = Router({mergeParams: true})
router.post("/add-to-watchList",verifyJWT,verifySubscription,profileCheck,addToWatchList)
router.delete("/remove-from-watchList",verifyJWT,verifySubscription,profileCheck,removeFromWatchList)
router.get("/get-profile-watchList",verifyJWT,verifySubscription,profileCheck,getProfileWatchList)
 
export default router
