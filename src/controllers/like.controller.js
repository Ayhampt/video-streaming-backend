import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Comment from "../models/comment.models.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const videoId = 
  
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  if (!commentId) {
    throw new ApiError(400, "missing commentId");
  }

  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "invalid commentId");
  }

  const userId = req.user._id;
  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(404, "comment not found");
  }

  const existingLike = await Like.findOne({
    comment: commentId,
    Likedby: userId,
  });

  if (existingLike) {
    await Like.findByIdAndDelete(existingLike._id);
  }

  await Like.create({
    comment: commentId,
    Likedby: userId,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "like toggled successfully"));
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  //TODO: toggle like on tweet
});

const getLikedVideos = asyncHandler(async (req, res) => {
  //TODO: get all liked videos
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
