import {addGenre, updateGenre, deleteGenre, getAllGenre, getGenre, getAllActiveGenre} from "../controller/genre.controller.js"
import { Router } from "express"
import {verifyAdmin} from "../middleware/admin.middleware.js"
import { verifyJWT } from "../middleware/auth.middleware.js"

const router = Router()

router.route("/add-genre").post(verifyJWT, verifyAdmin, addGenre)
router.route("/update-genre/:genre_id").patch(verifyJWT, verifyAdmin, updateGenre)
router.route("/delete-genre/:genre_id").delete(verifyJWT, verifyAdmin, deleteGenre)
router.route("/get-all-genres").get(verifyJWT, getAllGenre)
router.route("/get-all-active-genres").get(verifyJWT, getAllActiveGenre)
router.route("/get-genre/:genre_id").get(verifyJWT, getGenre)

export default router