import mongoose, { isValidObjectId } from "mongoose";

import jwt from "jsonwebtoken";

import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/apiErrors.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { deleteImage, uploadOnCloudinary } from "../utils/cloudinary.js";

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
    .skip((pageNumber - 1) * limitNumber);
  // .limit(limitNumber);

  return res.status(200).json(
    new ApiResponse(200, videos, {
      total: totalDocuments,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(totalDocuments / limitNumber),
    })
  );
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description, isPublished } = req.body;

  if (
    [title, description].some((field) => {
      field?.trim() === "";
    })
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // Title, description,thumbnail, video, isPublished, owner
  const thumbnailLocalPath = req.files?.thumbnail[0]?.path;

  let videoLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.video) &&
    req.files.video.length > 0
  ) {
    videoLocalPath = req.files.video[0].path;
  }

  // upload to cloudinary
  const thumbnailUploadResponse = await uploadOnCloudinary(thumbnailLocalPath);
  const videoUploadResponse = await uploadOnCloudinary(videoLocalPath);

  // Extract secure_url for database storage
  const thumbnail = thumbnailUploadResponse?.secure_url;
  const video = videoUploadResponse?.secure_url;

  if (!video) {
    throw new ApiError(400, "Video is required.");
  }

  // console.log(video, thumbnail, title, description, isPublished, req.user._id);

  try {
    const uploadedVideo = await Video.create({
      videoFile: video,
      thumbnail: thumbnail,
      title,
      description,
      duration: videoUploadResponse?.duration,
      isPublished,
      owner: req.user._id,
    });

    return res
      .status(200)
      .json(
        new ApiResponse(200, uploadedVideo, "Video uploaded successfully.")
      );
  } catch (error) {
    throw new ApiError(500, error, "Something went wrong.");
  }
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  try {
    const existVideo = await Video.findByIdAndUpdate(
      { _id: videoId },
      { $inc: { views: 1 } }, // Increment the views count by 1
      { new: true } // Return the updated document
    );

    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (token) {
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const user = await User.findById(decodedToken?._id).select(
        "-password -refreshToken"
      );
      if (user) {
        const videoIndex = user.watchHistory.indexOf(videoId);
      
        // If video is not in the history, add it
        if (videoIndex === -1) {
          user.watchHistory.push(videoId);
        } else {
          // If video exists, move it to the beginning
          user.watchHistory.splice(videoIndex, 1); // Remove it from its current position
          user.watchHistory.unshift(videoId); // Add it to the beginning
        }
        await user.save(); // Save the updated user document
      }
    }

    return res
      .status(200)
      .json(new ApiResponse(200, existVideo, "Video fetched successfully."));
  } catch (error) {
    throw new ApiError(500, error, "Video does't exist!");
  }
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: update video details like title, description, thumbnail
  const { title, description } = req.body;

  const thumbnailLocalPath = req.file?.path;

  const existedVideo = await Video.findById(videoId);

  // Get the old image
  const existThumbnail = existedVideo.thumbnail;

  console.log(existThumbnail);

  // public id of image
  const imageIdToBeDeleted = existThumbnail.thumbnail
    .split("/")[7]
    .split(".")[0];

  // upload new file to cloudinary
  const thumbnail = uploadOnCloudinary(thumbnailLocalPath);

  if (title) {
    existedVideo.title = title;
  }
  if (description) {
    existedVideo.description = description;
  }
  if (thumbnail) {
    existedVideo.thumbnail = thumbnail;
  }

  const updateVideo = await existedVideo.save();
  await deleteImage(imageIdToBeDeleted);

  res
    .status(200)
    .json(
      new ApiResponse(200, updateVideo, "Video has been updated successfully.")
    );
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

    if (!existVideo) {
      return res.status(404).json({ message: "Video not found" });
    }

    existVideo.isPublished = !existVideo.isPublished;

    const updatedVideo = await existVideo.save();
    // console.log(updatedVideo); // log the updated video status
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          updatedVideo,
          `Video publish status updated to ${existVideo.isPublished ? "published" : "unpublished"}`
        )
      );
  } catch (error) {
    throw new ApiError(500, "Something went wrong.");
  }
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
