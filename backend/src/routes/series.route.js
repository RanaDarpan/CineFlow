import {Router} from "express"
import {createSeries, deleteSeries,  updateSeries, getSeriesDetails, getAllSeries, getProfileSeries, getAllActiveSeries, searchSeries, updateThumbnail,} from "../controller/series.controller.js"
import {verifyJWT} from "../middleware/auth.middleware.js"
import {verifyAdmin} from "../middleware/admin.middleware.js"
import {profileCheck} from "../middleware/profile.middleware.js"
import { verifySubscription } from "../middleware/subscription.middleware.js"
import {upload} from "../middleware/multer.middleware.js"
 

const router = Router({mergeParams: true})

router.post("/create-series", verifyJWT, verifyAdmin, upload.single("thumbnail"),createSeries)
router.delete("/delete-series/:series_id", verifyJWT, verifyAdmin, deleteSeries)
router.patch("/update-series/:series_id",verifyJWT,verifyAdmin,updateSeries)
router.get("/get-series-details/:series_id", verifyJWT, verifySubscription, profileCheck, getSeriesDetails)
router.get("/get-all-series", verifyJWT,profileCheck,getAllSeries)
router.get("/get-all-active-series", verifyJWT,verifySubscription, profileCheck,getAllActiveSeries)
router.get("/get-profile-series", verifyJWT,verifySubscription,profileCheck,getProfileSeries)
router.get("/search-series",verifyJWT,verifySubscription,profileCheck,searchSeries)
router.patch("/update-thumbnail/:series_id",verifyJWT,verifyAdmin,upload.single("thumbnail"),updateThumbnail)

export default router