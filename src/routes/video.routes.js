import express from "express";

import {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
} from "../controllers/video.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

// Get All videos
router.route("/").get(getAllVideos);

// Upload video
router.route("/upload-video").post(
  verifyJwt,
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  publishAVideo
);

// update video
router
  .route("/update-video")
  .patch(verifyJwt, upload.single("thumbnail"), updateVideo);

// Get video By Id
router.route("/:videoId").get(getVideoById);

// Delete Video By Id
router.route("/:videoId").delete(verifyJwt, deleteVideo);

// Toggle Publish status
router.route("/video-status/:videoId").patch(verifyJwt, togglePublishStatus);

export default router;
