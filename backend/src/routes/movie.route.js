import {addMovie, getMovieDetails, deleteMovie, updateMovieDetails, updateThumbnail, updateVideo, getAllActiveMovies,getAllMovies, getProfileMovies} from "../controller/movie.controller.js"
import { Router } from "express"
import { verifyJWT } from "../middleware/auth.middleware.js"
import { verifyAdmin } from "../middleware/admin.middleware.js"
import { verifySubscription } from "../middleware/subscription.middleware.js"
import { profileCheck } from "../middleware/profile.middleware.js" 
import { upload } from "../middleware/multer.middleware.js"
  
const router = Router({ mergeParams: true })

router.post("/add-movie", verifyJWT, verifyAdmin, upload.fields([
    {
        name: "thumbnail",
        maxCount: 1
    },
    {
        name: "video",
        maxCount: 1
    }
]) ,addMovie)
router.get("/get-movie-detail/:movie_id", verifyJWT,verifySubscription, profileCheck,getMovieDetails)
router.get("/get-all-movies", verifyJWT, profileCheck,getAllMovies)
router.get("/get-all-active-movies", verifyJWT,verifySubscription,profileCheck,getAllActiveMovies)
router.delete("/delete-movie/:movie_id", verifyJWT,verifyAdmin,deleteMovie)
router.patch("/update-movie-details/:movie_id", verifyJWT,verifyAdmin,updateMovieDetails)
router.patch("/update-thumbnail/:movie_id", verifyJWT,verifyAdmin,upload.single("thumbnail"),updateThumbnail)
router.patch("/update-video/:movie_id", verifyJWT,verifyAdmin,upload.single("video"),updateVideo)
router.get("/get-profile-movies", verifyJWT,verifySubscription,profileCheck,getProfileMovies)

export default router