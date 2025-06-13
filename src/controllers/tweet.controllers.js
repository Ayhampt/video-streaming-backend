import { asyncHandler } from "../utils/acyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Tweet } from "../models/tweet.models.js";
import mongoose from "mongoose";
import { ApiResponse } from "../utils/ApiResponse.js";
//create a tweet
const writeTweet = asyncHandler(async (req, res) => {
  const { content } = req.body;

  if (!content) {
    throw new ApiError(401, "the content is required");
  }
  const tweet = await Tweet.create({
    owner: req.user._id,
    content: content,
  });

   await Tweet.aggregate([
    {
      $match: {
        _id: tweet._id,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "info",
      },
    },
    {
      $project: {
        "info.username": 1,
        "info.avatar": 1,
      },
    },
  ]);
  return res
    .status(200)
    .json(new ApiResponse(200, tweet, "the tweet is created"));
});
//delete the tweet
const deleteTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  if (!tweetId) {
    throw new ApiError("the tweet id required");
  }
  const tweet = await Tweet.findById(tweetId);

  if (tweet.owner != req.user._id.toString()
  ) {
    throw new ApiError(401, "you dont have acess to delete");
  }
  await Tweet.findByIdAndDelete(tweetId);

  return res
    .status(200)
    .json(new ApiResponse(200, tweet, "the tweet is deleted"));
});

//edit the tweet

const editTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const { content } = req.body;

  if (!tweetId) {
    throw new ApiError(401, "tweet id required");
  }

  const tweet = await Tweet.findById(tweetId);
 
  
  if (tweet.owner != req.user._id.toString()) {
    throw new ApiError("you dont have access to edit this tweet");
  }
  const tweetupdated = await Tweet.findByIdAndUpdate(
    tweetId,
    {
      $set: {
        content: content,
      },
    },
    { new: true }
  );
  return res
  .status(200)
  .json(new ApiResponse(200, tweetupdated, "the tweet is updated"));
});

export { writeTweet, deleteTweet ,editTweet};
