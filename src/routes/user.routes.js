import express from "express";

import {
  changeCurrentPassword,
  getCurrentUser,
  getUserChannelProfile,
  getWatchHistory,
  login,
  logOutUser,
  refreshAccessToken,
  registerUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
} from "../controllers/user.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

router.get("/temp", (req, res) => {
  res.json({
    message: "Hello world",
  });
});

router.route("/login").post(login);

//secured routes
router.route("/logout").post(verifyJwt, logOutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/chnage-password").post(verifyJwt, changeCurrentPassword);
router.route("/current-user").get(verifyJwt, getCurrentUser);
router.route("/update-account").patch(verifyJwt, updateAccountDetails);
router
  .route("/avatar")
  .patch(verifyJwt, upload.single("avatar"), updateUserAvatar);
router
  .route("/cover-image")
  .patch(verifyJwt, upload.single("coverImage"), updateUserCoverImage);
router.route("/c/:username").get(verifyJwt, getUserChannelProfile);
router.route("/history").get(verifyJwt, getWatchHistory);

export default router;
