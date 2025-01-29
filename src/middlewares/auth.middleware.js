import jwt from "jsonwebtoken";

import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiErrors.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyJwt = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized request. Please Login",
      });
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );
    
    
    if (!user) {
      return res.status(401).json({
        message: "Invalid access token. Please Login.",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong.",
    });
  }
});
