import mongoose from "mongoose";

import { Comment } from "../models/comment.model.js";
import { Video } from "../models/video.model.js";
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
      { $match: { video: new mongoose.Types.ObjectId(videoId) } },
    ]),
    options
  );

  if (!result.docs.length) {
    return res
      .status(200)
      .json(new ApiResponse(200, [], "No comments found for this video."));
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
  const { content } = req.body;

  const comment = await Comment.findById(commentId);

  if (!comment) {
    return res.status(400).json(new ApiResponse(400,"Comment not found."));
  }

  // Check ownership
  if (comment.owner.equals(req.user._id)) {
    comment.content = content;
    const updatedComment = await comment.save();

    if (!updatedComment) {
      return res.status(500).json(new ApiResponse(500,"Failed to update the comment."));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, updatedComment, "Comment updated successfully.")
      );
  } else {
    throw new ApiError(403, "You are not authorized to edit this comment.");
  }
});

const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  try {
    // Retrieve the comment and its associated video details
    const comment = await Comment.findById(commentId).populate({
      path: "video",
      select: "owner",
    });

    // Check if the comment exists
    if (!comment) {
      return res.status(404).json(new ApiResponse(404, "Comment not found."));
    }

    // Check if the user is authorized to delete the comment
    const isOwner = comment.owner.toString() === req.user._id.toString();
    const isVideoOwner =
      comment.video.owner.toString() === req.user._id.toString();

    if (isOwner || isVideoOwner) {
      await Comment.findByIdAndDelete(commentId);

      return res
        .status(200)
        .json(new ApiResponse(200, "Comment deleted successfully."));
    }

    // Unauthorized access
    return res
      .status(403)
      .json(new ApiResponse(403, "Unauthorized to delete this comment."));
  } catch (error) {
    // Handle any unexpected errors
    console.error(error);
    return res
      .status(500)
      .json(
        new ApiResponse(500, "An error occurred while deleting the comment.")
      );
  }
});

export { getVideoComments, addComment, updateComment, deleteComment };
