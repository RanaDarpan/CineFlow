import {registerUser, loginUser, logoutUser, refreshToken, changePassword, getCurrentUser} from "../controller/user.controller.js"
import { Router } from "express"
import { verifyJWT } from "../middleware/auth.middleware.js"

const router = Router()

router.route("/register").post(registerUser)
 
router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refreshToken").post(refreshToken)
router.route("/changePassword").patch(verifyJWT, changePassword)
router.route("/get-user").get(verifyJWT, getCurrentUser)

export default router
