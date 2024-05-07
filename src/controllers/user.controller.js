import User from "../models/user.model.js";
import { ApiError } from "../utils/apiErrors.js";
import { ApiError } from "../utils/apiErrors.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  // validation - not empty
  // check of user aleady exists: username email
  // check for image, check for avatar
  // upload them to cloudinary, avatar
  // create user object - create entry in db
  // remove password and refresh token field from response
  // check for user creation
  // return response

  const { fullname, email, username, password } = req.body;
  if (
    [fullname, email, username, password].some((field) => {
      field?.trim() === "";
    })
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [
      {
        username,
      },
      {
        email,
      },
    ],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exits");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalpath = req.files?.coverImage[0].path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required.");
  }
  if (!coverImageLocalpath) {
    throw new ApiError(400, "Cover image is required.");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalpath);

  if (!avatar) {
    throw new ApiError(400, "Avatar is required.");
  }
  if (!coverImage) {
    throw new ApiError(400, "Cover image is required.");
  }

  const user = await User.create({
    username: username.toLowerCase(),
    fullname,
    avatar: avatar.url,
    coverImage: coverImage.url || "",
    email,
    password,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while regestering user");
  }
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully."));
});

export { registerUser };
