import mongoose, { isValidObjectId } from "mongoose";

import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/apiErrors.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: toggle like on video

  const alreadyLiked = await Like.findOne({
    video: videoId,
    likedBy: req.user._id,
  });

  if (alreadyLiked) {
    const dislike = await Like.findOneAndDelete({
      likedBy: req.user._id,
      video: videoId,
    });

    return res.status(201).json(new ApiResponse(201, dislike, "Dislike video"));
  }

  const likedVideo = await Like.create({
    likedBy: req.user._id,
    video: videoId,
  });

  if (!likedVideo) {
    return res.status(500).json(new ApiResponse(500, "Something went wrong."));
  }

  return res.status(201).json(new ApiResponse(201, "Liked video"));
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  //TODO: toggle like on comment

  const alreadyLiked = await Like.findOne({
    comment: commentId,
    likedBy: req.user._id,
  });

  if (alreadyLiked) {
    await Like.findOneAndDelete({
      comment: commentId,
      likedBy: req.user._id,
    });

    return res.status(201).json(new ApiResponse(201, "Dislike comment"));
  }

  const likedComment = await Like.create({
    likedBy: req.user._id,
    comment: commentId,
  });

  if (!likedComment) {
    return res.status(500).json(new ApiResponse(500, "Something went wrong."));
  }

  return res.status(201).json(new ApiResponse(201, "Liked comment"));
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  //TODO: toggle like on tweet

  const alreadyLiked = await Like.findOne({
    tweet: tweetId,
    likedBy: req.user._id,
  });

  if (alreadyLiked) {
    await Like.findOneAndDelete({
      tweet: tweetId,
      likedBy: req.user._id,
    });

    return res.status(201).json(new ApiResponse(201, "Dislike tweet"));
  }

  const likedTweet = await Like.create({
    likedBy: req.user._id,
    tweet: tweetId,
  });

  if (!likedTweet) {
    return res.status(500).json(new ApiResponse(500, "Something went wrong."));
  }

  return res.status(201).json(new ApiResponse(201, "Liked tweet"));
});

const getLikedVideos = asyncHandler(async (req, res) => {
  //TODO: get all liked videos
  try {
    const likedVideos = await Like.find({
      likedBy: req.user._id,
      video: { $exists: true, $ne: null }, // Ensure the 'video' field exists and is not null
    })
      .populate({
        path: "video",
        select: "title description thumbnail duration views",
        populate: {
          path: "owner",
          select: "username avatar",
        },
      })
      .select("video");

    // Extract only the populated video details
    const videoDetails = likedVideos
      .map((like) => like.video)
      .filter((video) => video !== null);

    if (!likedVideos || likedVideos.length === 0) {
      throw new ApiError(404, "No liked video found");
    }

    return res.status(201).json(new ApiResponse(201, videoDetails));
  } catch (error) {
    console.error("Error fetching liked videos:", error);
    return res.status(500).json(new ApiResponse(500,"Internal server error."));
  }
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
