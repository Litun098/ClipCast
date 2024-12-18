import mongoose, { isValidObjectId } from "mongoose";

import Video from "../models/video.model.js";
import { ApiError } from "../utils/apiErrors.js";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;

  //   parse page and limit as integers
  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(page, 10);

  const queryObject = {};
  if (query) {
    queryObject.title = { $regex: query, $options: "1" };
  }
  if (userId) {
    queryObject.userId = userId;
  }

  //   Build the sort object
  const sortObject = {};
  if (sortBy) {
    sortObject[sortBy] = sortType.toLowerCase() === "desc" ? -1 : 1;
  }

  // calculate the total number of document for pagination
  const totalDocuments = await Video.countDocuments(queryObject);

  // Fetch video based on query, sorting, and pagination
  const videos = await Video.find(queryObject)
    .sort(sortObject)
    .skip((pageNumber - 1) * limitNumber)
    .limit(limitNumber);

  return res.status(200).json(
    new ApiResponse(videos, {
      total: totalDocuments,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(totalDocuments / limitNumber),
    })
  );
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  // TODO: get video, upload to cloudinary, create video

  // Get Video details
  //
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  try {
    const existVideo = await Video.findById(videoId);
  } catch (error) {
    throw new ApiError(500, "Video does't exist!");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, existVideo, "Video fetched successfully."));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: update video details like title, description, thumbnail
  const { title, description } = req.body;
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  try {
    await Video.findByIdAndDelete(videoId);
    
    return res
      .status(201)
      .json(new ApiResponse(200, "Video deleted successfully."));
  } catch (error) {
    throw new ApiError(500, error);
  }
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  try {
    const existVideo = await Video.findById(videoId);

    console.log(existVideo);

    if (!existVideo) {
      return res.status(404).json({ message: "Video not found" });
    }

    existVideo.isPublished = !existVideo.isPublished;

    const updatedVideo = await existVideo.save();
  } catch (error) {
    throw new ApiError(500, "Something went wrong.");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updateVideo,
        `Video publish status updated to ${existVideo.isPublished ? "published" : "unpublished"}`
      )
    );
});

module.exports = {
  getAllVideos,
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
