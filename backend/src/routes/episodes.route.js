import {getAllEpisodes,addEpisodes, updateEpisode, deleteEpisode, hardDeleteEpisode, getEpisodeDetail, getAllActiveEpisodes, getAllActiveSeriesEpisodes, updateVideo } from "../controller/episodes.controller.js"
import {Router} from "express"
import {verifyJWT} from "../middleware/auth.middleware.js"
import {verifyAdmin} from "../middleware/admin.middleware.js"
import {profileCheck} from "../middleware/profile.middleware.js"
import { verifySubscription } from "../middleware/subscription.middleware.js"
import {upload} from "../middleware/multer.middleware.js"

 const router = Router({mergeParams: true}) 
 router.post("/add-episode",verifyJWT,verifyAdmin,upload.single("video"),addEpisodes)
 router.patch("/update-episode/:episode_id",verifyJWT,verifyAdmin,updateEpisode)
 router.patch("/update-video/:episode_id",verifyJWT,verifyAdmin,upload.single("video"),updateVideo)
 router.delete("/delete-episode/:episode_id",verifyJWT, verifyAdmin, deleteEpisode)
 router.delete("/hard-delete-episode/:episode_id",verifyJWT,verifyAdmin,hardDeleteEpisode)
 router.get("/get-episode/:episode_id",verifyJWT,verifySubscription,profileCheck,getEpisodeDetail)
 router.get("/get-all-active-episodes",verifyJWT,verifySubscription,profileCheck,getAllActiveEpisodes)
 router.get("/all-active-series-episodes",verifyJWT,verifySubscription,profileCheck,getAllActiveSeriesEpisodes)
 router.get("/get-all-episodes", verifyJWT,verifyAdmin,getAllEpisodes)

 export default router


