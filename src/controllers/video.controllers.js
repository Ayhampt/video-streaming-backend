import { Video } from "../models/video.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/acyncHandler.js";
import { User } from "../models/user.models.js";
import mongoose from "mongoose";

//publishAVideo
const PublishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    throw new ApiError(400, "Title and description are required");
  }
  const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;
  const videoLocalPath = req.files?.videoFile?.[0]?.path;

  if (!thumbnailLocalPath) {
    throw new ApiError(401, "thumbnail file required");
  }
  if (!videoLocalPath) {
    throw new ApiError(401, "video file required");
  }

  let thumbnailFile;
  try {
    thumbnailFile = await uploadOnCloudinary(thumbnailLocalPath);
    console.log("thumbnail file upload sucessfully", thumbnailFile);
  } catch (error) {
    throw new ApiError(401, "something gone wrong while uploading thumbnail");
  }

  let videoFile;
  try {
    videoFile = await uploadOnCloudinary(videoLocalPath);
    console.log("Videofile upload sucessfully", videoFile);
  } catch (error) {
    throw new ApiError(401, "something gone wrong while uploading videoFile");
  }

  const user = await User.findById(req.user?._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const video = await Video.create({
    videoFile: videoFile?.url,
    thumbnail: thumbnailFile?.url,
    title: title.trim(),
    description: description,
    owner: req.user._id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, video, "the video Published sucessfully"));
});

//get video by id
const getvideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!videoId) {
    throw new ApiError(400, "videoId is required");
  }
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "video not found");
  }
  const videoData = {
    _id: video._id,
    videoFile: video.videoFile,
    thumbnail: video.thumbnail,
    title: video.title,
    description: video.description,
    views: video.views,
    isPublished: video.isPublished,
    createdAt: video.createdAt,
    updatedAt: video.updatedAt,
    owner: video.owner,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, videoData, "video fetched sucessfully"));
});
//get all videos
const getAllVideos = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    query,
    sortBy = "createdAt", 
    sortType = "desc", 
    userId,
  } = req.query;

  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit);
  const skip = (pageNumber - 1) * limitNumber;
  const sortDirection = sortType === "desc" ? -1 : 1;

  // Optional search filter
  const searchFilter = query
    ? {
        $or: [
          { title: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
        ],
      }
    : {};

  // Match condition based on userId or null
  const matchCondition = userId
    ? { owner: new mongoose.Types.ObjectId(userId), ...searchFilter }
    : { ...searchFilter };

  // Get total count for pagination (optional)
  const total = await Video.countDocuments(matchCondition);

  // Aggregation pipeline
  const videos = await Video.aggregate([
    { $match: matchCondition },
    { $sort: { [sortBy]: sortDirection } },
    { $skip: skip },
    { $limit: limitNumber },
    {
      $project: {
        _id: 1,
        videoFile: 1,
        thumbnail: 1,
      },
    },
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        videos,
        total,
        totalPages: Math.ceil(total / limitNumber),
        currentPage: pageNumber,
      },
      "Videos fetched successfully"
    )
  );
});

//update videoDetails
const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { title, description } = req.body;
  const thumbnailLocalPath = req.file?.path;

  if (!videoId) {
    throw new ApiError(400, "video Id is required");
  }
  if (!title || !description) {
    throw new ApiError(400, "title and description are required");
  }
  
  
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
  
  if (!thumbnail.url) {
    throw new ApiError(401, "somthing went wrong while upload");
  }


  const video = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: {
        title: title,
        description: description,
        thumbnail: thumbnail.url,
      },
    },
    {
      new: true,
    }
  );
  if (!video) {
    throw new ApiError(500, "failed to update the video");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, video, "video details updated sucessfully"));
});

//delete the video

const deleteTheVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) {
    throw new ApiError(400, "video Id is required or you are not authorized" );
  }
  const video = await Video.findById(videoId);
  if (video.owner.toString() != req.user._id.toString()) {
    throw new ApiError(404, "video not found");
  }

  await Video.findByIdAndDelete(videoId)
  
  return res
    .status(200)
    .json(new ApiResponse(200, video, "video deleted sucessfully"));
});

//togglePublishStatus
const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const video = await Video.findById(videoId)
  if (!video) {
    throw new ApiError(404, "video not found");
  }
  if(video.owner.toString() !== req.user._id.toString()){
    throw new ApiError(401,"you are not authorized");
  }
  
  await Video.findByIdAndUpdate(
    videoId,
    {
      $set: {
        isPublished: !video.isPublished,
      },
    },
    {
      new: true,
    }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video publish status toggled"));
})


export {
  PublishAVideo,
  getvideoById,
  getAllVideos,
  updateVideo,
  deleteTheVideo,
  togglePublishStatus,
};
