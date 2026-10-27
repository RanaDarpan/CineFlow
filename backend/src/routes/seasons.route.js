import { Router } from "express";
import { verifyAdmin } from "../middleware/admin.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { profileCheck } from "../middleware/profile.middleware.js"
import { verifySubscription } from "../middleware/subscription.middleware.js";
import {addSeason, deleteSeason, updateSeason, getAllSeasons, getAllActiveSeasons, getSeason, searchSeason} from "../controller/seasons.controller.js"
 
const router = Router({mergeParams: true})
router.post("/add-season",verifyJWT,verifyAdmin,addSeason)
router.delete("/delete-season/:season_id", verifyJWT, verifyAdmin, deleteSeason)
router.patch("/update-season/:season_id", verifyJWT,verifyAdmin, updateSeason)
router.get("/get-active-series-season", verifyJWT, verifySubscription, profileCheck, getAllActiveSeasons)
router.get("/get-series-season", verifyJWT, verifyAdmin, getAllSeasons)
router.get("/get-season/:season_id", verifyJWT,verifySubscription,profileCheck, getSeason)
router.get("/search-seasons", verifyJWT,verifySubscription, profileCheck, searchSeason)

export default router