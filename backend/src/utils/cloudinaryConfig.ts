import { v2 as cld } from "cloudinary";

cld.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
class Cloudinary {
  async uploadImage(filePath: string) {
    const data = await cld.uploader.upload(filePath, {
      upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
    });
    return data;
  }

  async deleteImage(imgPublicId: string) {
    await cld.uploader.destroy(imgPublicId);
  }
}

export const cloudinary = new Cloudinary();
