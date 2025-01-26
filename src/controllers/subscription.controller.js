import mongoose, { isValidObjectId } from "mongoose";

import { Subscription } from "../models/subscription.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiErrors.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  const alreadySubscribed = await Subscription.findOne({
    subscriber: req.user._id,
    channel: channelId,
  });

  if (alreadySubscribed) {
    await Subscription.findOneAndDelete({ subscriber: req.user._id });

    return res.status(200).json(new ApiResponse(200, "Unsubscribed,"));
  }

  // Query using _id (if that's the correct field for the channel)
  const channel = await User.findOne({ _id: channelId }).select(
    "username avatar _id"
  );

  if (!channel) {
    throw new ApiError(404, "Channel not found");
  }

  const subscribe = await Subscription.create({
    subscriber: req.user._id,
    channel: channel._id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, `Subscribed to ${channel.username}`));
});

// controller to return subscriber list of a channel
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  const subscribers = await Subscription.find({ channel: channelId }).populate({
    path: "subscriber",
    select: "_id username avatar",
  });

  if (!subscribers) {
    return res.status(200).json(new ApiResponse(200, "0 Subscribers"));
  }

  return res.status(200).json(new ApiResponse(200, subscribers));
});

// controller to return channel list to which user has subscribed
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;

  const channels = await Subscription.find({subscriber:subscriberId}).populate({path:"channel", select:"username avatar"});

  console.log(channels);
  if(!channels){    
    return res.status(400).json(new ApiResponse(400,"No subscriptions yet."));
  }

  return res.status(200).json(new ApiResponse(200,channels));
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
