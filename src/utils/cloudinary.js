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
    
    fs.unlinkSync(localFilePath)
    return response;
    
  } catch (error) {
    fs.unlinkSync(localFilePath) // remove the locally saved temp file as the upload operation got failed
    
    return null;
  }
};


// Todo
const deleteDuplicateFile = async()=>{
  const response = await cloudinary.v2.api
  .delete_resources(['cld-sample'], 
    { type: 'upload', resource_type: 'image' })
  .then(console.log);

  // cloudinary.v2.api.delete_resources(public_ids, options).then(callback);
  console.log(response)
}


export {uploadOnCloudinary}