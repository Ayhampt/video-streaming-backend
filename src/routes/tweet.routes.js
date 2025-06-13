import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  writeTweet,
  deleteTweet,
  editTweet,
} from "../controllers/tweet.controllers.js";

const router = Router()

router.route("/wTweet").post(verifyJWT,writeTweet)
router.route("/editTweet/:tweetId").patch(verifyJWT,editTweet)
router.route("/deleteTweet/:tweetId").delete(verifyJWT,deleteTweet)


export default router