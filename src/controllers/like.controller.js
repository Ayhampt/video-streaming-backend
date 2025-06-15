import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/acyncHandler.js";
import { Comment } from "../models/comment.models.js";
import { Video } from "../models/video.model.js";
import { Tweet } from "../models/tweet.models.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) {
    throw new ApiError(400, "video id required");
  }
  const user = req.user._id;
  if (!user) {
    throw new ApiError(400, "you need to login");
  }
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(400, "no video find");
  }
  const existingLike = await Like.findOne({
    Likedby: user,
    video: videoId,
  });

  if (existingLike) {
    await Like.findByIdAndDelete(existingLike._id);
    return res
      .status(200)
      .json(new ApiResponse(200, null, "video unliked successfully"));
  }
  await Like.create({
    Likedby: user,
    video: videoId,
  });

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
    Likedby: userId,
    comment: commentId,
  });

  if (existingLike) {
    await Like.findByIdAndDelete(existingLike._id);

    return res
      .status(200)
      .json(new ApiResponse(200, null, "comment unliked successfully"));
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
  if (!tweetId) {
    throw new ApiError(400, "tweet id required");
  }
  const user = req.user._id;
  const tweet = await Tweet.findById(tweetId);
  if (!tweet) {
    throw new ApiError(400, "no tweet exist");
  }
  const existingLike = await Like.findOne({
    Likedby: user,
    tweet: tweetId,
  });
  if (existingLike) {
    await Like.findByIdAndDelete(existingLike._id);
    return res
      .status(200)
      .json(new ApiResponse(200, null, "Tweet unliked successfully"));
  }
  await Like.create({
    tweet: tweetId,
    Likedby: user,
  });
  return res
    .status(200)
    .json(new ApiResponse(200, null, "tweet like toggled sucessfully"));
});

const getLikedVideos = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    throw new ApiError(400, "missing userId");
  }
  const user = await findById(userId);
  if (!user) {
    throw new ApiError(404, "user not found");
  }

  const likedVideos = await Like.aggregate([
    {
      $match: {
        Likedby: userId,
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "video",
      },
    },
    {
      $unwind: "$video",
    },
    {
      $project: {
        _id: 0,
        videoId: "$video._id",
        title: "$video.title",
        description: "$video.description",
      },
    },
  ]);
  return res
    .status(200)
    .json(
      new ApiResponse(200, likedVideos, "Liked videos fetched successfully")
    );
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
