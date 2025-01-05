import mongoose, { isValidObjectId } from "mongoose";

import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/apiErrors.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  //create playlist
  const playlist = await Playlist.create({
    name,
    description,
    owner: req.user._id,
  });

  if (!playlist) {
    throw new ApiError(400, "Failed to create playlist");
  }
  res
    .status(201)
    .json(new ApiResponse(201, { playlist }, "Playlist created successfully"));
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  //get user playlists
  
  const playLists = await Playlist.find({ owner: userId });

  if (!playLists) {
    throw new ApiError(404, "No playlists found");
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, { playLists }, "Playlists fetched successfully")
    );
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  // get playlist by id

  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, "Invalid playlist id");
  }

  const playlist = await Playlist.findById({ _id:playlistId }).populate({
    path: "owner",
    select: "username avatar",
  });

  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, { playlist }, "Playlist fetched successfully"));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;

  const playlist = await Playlist.findById(playlistId);

  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }

  playlist.videos.push(videoId);

  await playlist.save();

  res
    .status(200)
    .json(
      new ApiResponse(200, { playlist }, "Video added to playlist successfully")
    );
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  // remove video from playlist

  const playlist = await Playlist.findById(playlistId);

  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }

  const videoIndex = playlist.videos.indexOf(videoId);

  if (videoIndex === -1) {
    throw new ApiError(404, "Video not found in playlist");
  }

  playlist.videos.splice(videoIndex, 1);
  await playlist.save();

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { playlist },
        "Video removed from playlist successfully"
      )
    );
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  //delete playlist

  const playlist = await Playlist.findByIdAndDelete(playlistId);

  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist deleted successfully"));
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;
  //update playlist

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }

  if (name) {
    playlist.name = name;
  }
  if (description) {
    playlist.description = description;
  }

  await playlist.save();

  res
    .status(200)
    .json(new ApiResponse(200, { playlist }, "Playlist updated successfully"));
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
