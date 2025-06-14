import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {Comment} from "../models/comment.models.js";
import { Video } from "../models/video.model.js";
import { Tweet } from "../models/tweet.models.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if(!videoId){
    throw new ApiError(400,"video id required")
  }
  const user = req.user._id
  if(!user){
    throw new ApiError(400,"you need to login")
  }
  const video = await Video.findById(videoId)
  if(!video){
    throw new ApiError(400,"no video find")
  }
  const existingLike = await Like.findOne({
    $or:[
      {Likedby:user},
      {video:videoId}
    ]
  })

  if(existingLike){
    await Like.findByIdAndDelete(existingLike._id)
  }
  await Like.create({
    Likedby:user,
    video:videoId
  })

   return res
     .status(200)
     .json(new ApiResponse(200, null, "video like toggled successfully"));
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
    $or:[
      {Likedby : userId},
      {comment:commentId}
    ]
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
    .json(new ApiResponse(200, null, "comment like toggled successfully"));
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  if(!tweetId){
    throw new ApiError(400,"tweet id required")
  }
  const user = req.user._id
  const tweet = await Tweet.findById(tweetId)
  if(!tweet){
    throw new ApiError(400,"no tweet exist")
  }
  const existingLike = await Like.findOne({
    $or:[
      {Likedby:user},
      {tweet:tweetId}
    ]
  })
  if(existingLike){
    await Like.findByIdAndDelete(existingLike._id)
  }
  await Like.create({
    tweet:tweetId,
    Likedby:user
  })
  return res
  .status(200)
  .json(new ApiResponse(200,null,"tweet like toggled sucessfully"))
});

const getLikedVideos = asyncHandler(async (req, res) => {
  


  
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
