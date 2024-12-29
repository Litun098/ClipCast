import mongoose, { isValidObjectId } from "mongoose";

import { Subscription } from "../models/subscription.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiErrors.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  // Query using _id (if that's the correct field for the channel)
  const channel = await User.findOne({ _id: channelId });

  if (!channel) {
    throw new ApiError(404, "Channel not found");
  }

  const subscribe = await Subscription.create({
    subscriber: req.user._id,
    channel: channel._Id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, `Subscribed to ${channel.username}`));
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
