import mongoose, { isValidObjectId } from "mongoose";

import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiErrors.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
  //TODO: create tweet
  const { content } = req.body;

  const tweet = await Tweet.create({ content, owner: req.user._id });

  if (!tweet) {
    return res.status(500).json({
      message: "Something went wrong.",
    });
  }

  return res.status(200).json(new ApiResponse(201, tweet));
});

const getUserTweets = asyncHandler(async (req, res) => {
  // TODO: get user tweets
  const { userId } = req.params;

  if (!isValidObjectId(userId)) {
    return res.status(400).json({
      message: "Invalid user Id.",
    });
  }

  const tweets = await Tweet.find({ owner: userId }, { createdAt: 1 })
    .populate({
      path: "owner",
      select: "username avatar",
    })
    .select("_id content createdAt owner");

  if (tweets.length == 0) {
    return res.status(400).json({
      message: "No tweet found.",
    });
  }
  return res.status(200).json(new ApiResponse(201, tweets, "Tweets fetched."));
});

const updateTweet = asyncHandler(async (req, res) => {
  //TODO: update tweet
  const { tweetId } = req.params;
  const { content } = req.body;

  if (!isValidObjectId(tweetId)) {
    return res.status(400).json({
      message: "Invalid tweet Id.",
    });
  }

  const tweet = await Tweet.findOneAndUpdate(
    { _id: tweetId },
    { $set: { content: content } },
    { new: true }
  );

  if (!tweet) {
    return res.status(500).json({
      message: "Something went wrong.",
    });
  }

  return res
    .status(200)
    .json(new ApiResponse(200, tweet, "Tweet updated successfully"));
});

const deleteTweet = asyncHandler(async (req, res) => {
  //TODO: delete tweet
  const { tweetId } = req.params;

  if (!isValidObjectId(tweetId)) {
    return res.status(400).json({
      message: "Invalid tweet Id.",
    });
  }

  const tweet = await Tweet.findByIdAndDelete({ _id: tweetId });

  if (!tweet) {
    return res.status(400).json({
      message: "Tweet not found.",
    });
  }

  return res
    .status(200)
    .json(new ApiResponse(200, tweet, "Tweet deleted successfully."));
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
