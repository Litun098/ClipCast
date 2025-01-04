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
    throw new ApiError(500, "Something went wrong.");
  }

  return res.status(200).json(new ApiResponse(201, tweet));
});

const getUserTweets = asyncHandler(async (req, res) => {
  // TODO: get user tweets
  const { userId } = req.params;

  console.log(userId);
  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid user id.");
  }

  const tweets = await Tweet.find({
    owner: userId,
  }).populate({
    path: "owner",
    select: "username avatar",
  });

  if (tweets.length == 0) {
    return res.status(404).json(new ApiResponse(404, "No tweet found."));
  }
  return res.status(200).json(new ApiResponse(201, tweets, "Tweets fetched."));
});

const updateTweet = asyncHandler(async (req, res) => {
  //TODO: update tweet
  const { tweetId } = req.params;
  const { content } = req.body;

  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid tweet id.");
  }

  const tweet = await Tweet.findOneAndUpdate(
    { _id: tweetId },
    { $set: { content: content } }
  );

  if (!tweet) {
    throw new ApiError(500, error, "Something went wrong");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, tweet, "Tweet updated successfully"));
});

const deleteTweet = asyncHandler(async (req, res) => {
  //TODO: delete tweet
  const { tweetId } = req.params;

  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid tweet id.");
  }

  const tweet = await Tweet.findByIdAndDelete({_id:tweetId});

  if (!tweet) {
    throw new ApiError(404, "Tweet not found.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, tweet, "Tweet deleted successfully."));
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
