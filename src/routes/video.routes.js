import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getAllVideos,
  PublishAVideo,
  getvideoById,
  updateVideo,
  deleteTheVideo,
  togglePublishStatus,
} from "../controllers/video.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";
import { asyncHandler } from "../utils/acyncHandler.js";
import { writeTweet } from "../controllers/tweet.controllers.js";

const router = Router();

router.route("/Publish").post(verifyJWT,
  upload.fields([
    {
      name: "thumbnail",
      maxCount: 1,
    },
    {
      name: "videoFile",
      maxCount: 1,
    },
  ]),
  asyncHandler(PublishAVideo)
);
router.route("/getById/:videoId").get(getvideoById);
router.route("/getVideos").get(getAllVideos);
router
  .route("/updatevideo/:videoId")
  .patch(verifyJWT, upload.single("thumbnail"), updateVideo);
router.route("/delete/:videoId").post(verifyJWT, deleteTheVideo);
router.route("/t/:videoId").post(verifyJWT,togglePublishStatus);
router.route("/tweet").post(verifyJWT, writeTweet);

export default router;
