import mongoose, { isValidObjectId } from "mongoose";

import { Like } from "../models/like.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/apiErrors.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channel ID.");
  }

  console.log(channelId);

  const userDetails = await User.findById(channelId);
  
  // Fetch total videos and total views for the channel
  const videosStats = await Video.aggregate([
    { $match: { owner: channelId } },
    {
      $group: {
        _id: null,
        totalVideos: { $sum: 1 },
        totalViews: { $sum: "$views" },
      },
    },
  ]);

  const totalVideos = videosStats[0]?.totalVideos || 0;
  const totalViews = videosStats[0]?.totalViews || 0;

  // Fetch total subscribers for the channel
  const totalSubscribers = await Subscription.countDocuments({
    channel: channelId,
  });

  // Fetch total likes on all videos by the channel
  const totalLikes = await Like.countDocuments({
    video: { $in: await Video.find({ owner: channelId }).distinct("_id") },
  });

  // Response with stats
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        userDetails,
        totalVideos,
        totalViews,
        totalSubscribers,
        totalLikes,
      },
      "Channel stats fetched successfully."
    )
  );
});

const getChannelVideos = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channel ID.");
  }

  // Fetch all videos uploaded by the channel
  const videos = await Video.find({ owner: channelId })
    .sort({ createdAt: -1 }) // Sort videos by most recent first
    .select("title description thumbnail views duration createdAt"); // Select specific fields for a concise response

  if (!videos.length) {
    throw new ApiError(404, "No videos found for this channel.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Channel videos fetched successfully."));
});

export { getChannelStats, getChannelVideos };
