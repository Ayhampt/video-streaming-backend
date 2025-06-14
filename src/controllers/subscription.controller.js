import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/acyncHandler.js";
import { Subscription } from "../models/subscription.models.js";
import mongoose from "mongoose";
import { ApiResponse } from "../utils/ApiResponse.js";

//toggleSubscription
const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!channelId) {
    throw new ApiError(400, "the channel id required");
  }

  if (channelId === req.user._id) {
    throw new ApiError(400, "you can not subscribe to yourself");
  }

  const channel = await User.findById(channelId);

  if (!channel) {
    throw new ApiError(404, "channel not found");
  }

  const existingSubscription = await Subscription.findOne({
    subscriber: req.user._id,
    channel: channelId,
  });

  if (existingSubscription) {
    await Subscription.findByIdAndDelete(existingSubscription._id);
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "unsubscribed successfully"));
  }

  const newSubscription = await Subscription.create({
    subscriber: req.user._id,
    channel: channelId,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, newSubscription, "subscribed successfully"));
});

//get channel subscribers
const getChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!channelId) {
    throw new ApiError(400, "the channel id required");
  }

  const channel = await User.findById(channelId);

  if (!channel) {
    throw new ApiError(404, "channel not found");
  }

  const subscribers = await Subscription.aggregate([
    {
      $match: {
        channel: new mongoose.Types.ObjectId(channelId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "subscriber",
        foreignField: "_id",
        as: "subscriber",
      },
    },
    {
      $unwind: "$subscriber",
    },
    {
      $project: {
        _id: "$subscriber._id",
        username: "$subscriber.username",
        avatar: "$subscriber.avatar",
      },
    },
  ]);
  const subscriberCount = await Subscription.aggregate([
    {
      $match: {
        channel: new mongoose.Types.ObjectId(channelId),
      },
    },
    {
      $count: "subscriberCount",
    },
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        subscribers,
        subscriberCount: subscriberCount[0]?.subscriberCount || 0,
      },
      "subscribers fetched successfully"
    )
  );
});

const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;

  if (!subscriberId) {
    throw new ApiError(400, "the subscriberId requird");
  }

  const subscriber = await User.findById(subscriberId);

  if (!subscriber) {
    throw new ApiError(400, "no subscriber found");
  }

  const channelList = await Subscription.aggregate([
    {
      $match: {
        subscriber: new mongoose.Types.ObjectId(subscriberId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "channel",
        foreignField: "_id",
        as: "subscribedTo",
      },
    },
    {
      $unwind: "$subscribedTo",
    },
    {
      $project: {
        _id: "$subscribedTo._id",
        username: "$subscribedTo.username",
      },
    },
  ]);
  return res
  .status(200)
  .json(new ApiResponse(200,channelList,"the channel list feched successfully"))
});

export { toggleSubscription, getChannelSubscribers, getSubscribedChannels};
