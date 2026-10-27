import {v2 as cloudinary} from "cloudinary"
import fs from "fs"
import ApiError from "./ApiError.js"
import {fileTypeFromFile} from "file-type"

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async function (filePath) {
    try {
    if (!filePath) return null;

    const fileType = await fileTypeFromFile(filePath);
    let response;

    if (fileType?.ext === "mp4") {
      console.log("Uploading video to Cloudinary (chunked)...");
      response = await cloudinary.uploader.upload(filePath, {
        resource_type: "video",
      });
    } else {
      console.log("Uploading asset to Cloudinary...");
      response = await cloudinary.uploader.upload(filePath, {
        resource_type: "auto",
      });
    }

    fs.unlinkSync(filePath);
    return response;
    }
  catch (error) {
    console.error("Cloudinary upload error:", error);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    return null;
    }
}

export default uploadOnCloudinary