import { v2 as cloudinary } from "cloudinary";

import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    // upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); // remove the locally saved temp file as the upload operation got failed

    return null;
  }
};

// Delete old file from cloudinary
export const deleteImage = async (image_id) => {
  const response = await cloudinary.api
    .delete_resources([image_id], { type: "upload", resource_type: "image" })
    .then(() => {
      console.log("Image deleted from cloudinary.");
    })
    .catch((error) => {
      console.log(error);
    });
};

export { uploadOnCloudinary };