import mongoose from "mongoose";
import { Comment } from "../models/comment.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/acyncHandler.js";

const getVideoComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;
  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit);
  if (!videoId) {
    throw new ApiError(400, "videoId required");
  }
  const comments = await Comment.aggregate([
    {
      $match: {
        video: new mongoose.Types.ObjectId(videoId),
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
    {
      $limit: limitNumber,
    },
    {
      $project: {
        content: 1,
      },
    },
  ]);

  return res
  .status(200)
  .json(new ApiResponse(200, comments, "comments fetched successfully"));
});

const addComment = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { content } = req.body;
  if (!content || !videoId) {
    throw new ApiError(400, "comment content and videoId are required");
  }
  const user = req.user._id;

  const comment = await Comment.create({
    video: videoId,
    owner: user,
    content,
  });
  return res
    .status(200)
    .json(new ApiResponse(200, comment, "the comment for video created"));
});

const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;

  if (!content|| !commentId) {
    throw new ApiError(400, "Missing commentId or content");
  }
  const update = await Comment.findByIdAndUpdate(
    commentId,
    {
      $set: {
        content,
      },
    },
    { new: true }
  );
  return res
    .status(200)
    .json(new ApiResponse(200, update, "the comment updated for video "));
});

const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  if (!commentId) {
    throw new ApiError(400, "missing commentId");
  }
  const comment = await Comment.findByIdAndDelete(commentId);

  return res
    .status(200)
    .json(new ApiResponse(200, comment, "the comment deteleted"));
});

export { getVideoComments, addComment, updateComment, deleteComment };
