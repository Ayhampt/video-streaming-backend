import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { writeTweet } from "../controllers/tweet.controllers.js";

const router = Router()

router.route("/wTweet").post(verifyJWT,writeTweet)

export default router