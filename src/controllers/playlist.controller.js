import mongoose, { isValidObjectId } from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/acyncHandler.js";
import { Playlist } from "../models/playlist.models.js";


const createPlaylist = asyncHandler(async (req, res) => {
  const { playlistName, description } = req.body;

  if (!playlistName || !description) {
    throw new ApiError(400, "name and description are required");
  }
  const playlist = await Playlist.create({
    owner: req.user._id,
    name: playlistName,
    description: description,
  });
  if (!playlist) {
    throw new ApiError(401, "something gone wrong while creating playlist");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "playlist created successfully"));
});
//get user playlist
const getUserPlaylists = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const playlists = await Playlist.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $project: {
        name: 1,
        description: 1,
        Videos: 1,
        createdAt: 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(200, playlists, "User playlists fetched successfully")
    );
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  if (!playlistId || !isValidObjectId(playlistId)) {
    throw new ApiError(400, "Valid playlist ID is required");
  }

  const playlist = await Playlist.findOne({
    _id: playlistId,
    owner: req.user._id, 
  });

  if (!playlist) {
    throw new ApiError(404, "Playlist not found or access denied");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist fetched successfully"));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;

  if (!playlistId || !videoId) {
    throw new ApiError(400, "Playlist ID or Video ID is missing");
  }

  if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid Playlist ID or Video ID");
  }

  const playlist = await Playlist.findOneAndUpdate(
    {
      _id: playlistId,
      owner: req.user._id,
    },
    {
      $addToSet: { Videos: videoId },
    },
    { new: true }
  );

  if (!playlist) {
    throw new ApiError(404, "Playlist not found or access denied");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        playlist,
        "The video was added to the playlist successfully"
      )
    );
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;

  if (!playlistId || !videoId) {
    throw new ApiError(400, "Playlist ID and Video ID are required");
  }

  if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid Playlist ID or Video ID");
  }

  const updatedPlaylist = await Playlist.findOneAndUpdate(
    {
      _id: playlistId,
      owner: req.user._id,
    },
    {
      $pull: { Videos: videoId },
    },
    { new: true }
  );

  if (!updatedPlaylist) {
    throw new ApiError(404, "Playlist not found or access denied");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedPlaylist,
        "Video removed from playlist successfully"
      )
    );
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  if (!playlistId) {
    throw new ApiError(400, "the playlistId required");
  }

  const playlist = await Playlist.findOneAndDelete({
    _id: playlistId,
    owner: req.user._id,
  });
  if (!playlist) {
    throw new ApiError(400, "error while deleteing the playlist");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "the playlist deleted sucessfully"));
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;

  if (!playlistId) {
    throw new ApiError("playlist id missing");
  }
  if (!name || !description) {
    throw new ApiError("name or description required");
  }
  const playlist = await Playlist.findByIdAndUpdate(
    { _id: playlistId, owner: req.user._id },

    {
      $set: {
        playlistName: name,
        description: description,
      },
    },
    {
      new: true,
    }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "the playlist updated sucess"));
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
