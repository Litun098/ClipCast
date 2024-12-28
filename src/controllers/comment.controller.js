import mongoose from "mongoose";

import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/apiErrors.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getVideoComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    populate: [
      { path: "owner", select: "username email" }, // Include owner details
      { path: "video", select: "title" }, // Include video details
    ],
    sort: { createdAt: -1 }, // Sort by latest comments
  };

  const result = await Comment.aggregatePaginate(
    Comment.aggregate([
      { $match: { video: mongoose.Types.ObjectId(videoId) } },
    ]),
    options
  );

  if (!result.docs.length) {
    throw new ApiError(404, "No comments found for this video.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Comments fetched successfully."));
});

const addComment = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const content = req.body.content;

  if (!content) {
    throw new ApiError(400, "Please add content.");
  }

  const newComment = await Comment.create({
    content,
    video: videoId,
    owner: req.user._id,
  });

  if (!newComment) {
    throw new ApiError(500, "Something went wrong");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, newComment, "Comment added successfully."));
});

const updateComment = asyncHandler(async (req, res) => {
  // TODO: update a comment
  const { commentId } = req.params;
  const content = req.body;

  const comment = await Comment.findById(commentId);

  comment.content = content;

  const updatedComment = await comment.save();

  if (!updatedComment) {
    throw new ApiError(500, "Something went wrong.");
  }

  return res
    .status(200)
    .json(ApiResponse(200, updatedComment, "Comment updated successfully."));
});

const deleteComment = asyncHandler(async (req, res) => {
  // TODO: delete a comment
  const { commentId } = req.params;

  const commentToBeDeleted = await Comment.findByIdAndDelete(commentId);

  console.log(commentToBeDeleted);

  return res
    .status(200)
    .json(new ApiResponse(200, "Comment deleted successfully."));
});

export { getVideoComments, addComment, updateComment, deleteComment };
