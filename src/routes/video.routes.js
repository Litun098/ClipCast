import express from "express";

import {
  getAllVideos,
  publishAVideo,
} from "../controllers/video.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

// Get All videos
router.route("/video").get(getAllVideos);
router.route("/upload-video").post(
  verifyJwt,
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  publishAVideo
);

export default router;
