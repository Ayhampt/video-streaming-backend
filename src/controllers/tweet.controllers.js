import { asyncHandler } from "../utils/acyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Tweet } from "../models/tweet.models.js";
import mongoose from "mongoose";

const writeTweet = asyncHandler(async (req) => {
  const { content } = req.body;

  if (!userid) {
    throw new ApiError(401, "user not found");
  }
  await Tweet.create({
    owner: req.user._id,
    content: content,
  });

 const findOwner = await Tweet.aggregate([
    {
      $match:{
        owner:new mongoose.Types.ObjectId(req.user._id)
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "ownerDetails",
        pipeline: [
          {
            $project: {
              username: 1,
              avatar: 1,
            },
          },
          {
            $addFields:"$ownerDetails"
          }
        ],
      },
    },
  ]);
  return res
    .status(200)
    .json(new ApiResponse(200, findOwner, "the tweet Published sucessfully"));
});
export {writeTweet}
