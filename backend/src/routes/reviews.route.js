import { addReview, updateReview, deleteReview, getContentReview, getProfileReview, allReviews } from "../controller/reviews.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { verifySubscription } from "../middleware/subscription.middleware.js";
import { profileCheck } from "../middleware/profile.middleware.js"
import { Router } from "express"
import { verifyAdmin } from "../middleware/admin.middleware.js";
console.log("HIT getContentReview");

const router = Router({mergeParams: true})

router.post("/add-review", verifyJWT,verifySubscription,profileCheck,addReview)
router.patch("/update-review/:review_id", verifyJWT,verifySubscription,profileCheck,updateReview)
router.delete("/delete-review/:review_id", verifyJWT,verifySubscription,profileCheck,deleteReview)
router.get("/get-content-reviews/:content_type/:content_id",verifyJWT,verifySubscription,profileCheck,getContentReview)
router.get("/get-profile-reviews", verifyJWT,verifySubscription,profileCheck,getProfileReview)
router.get("/get-all-reviews",verifyJWT, verifyAdmin, allReviews)

export default router
 