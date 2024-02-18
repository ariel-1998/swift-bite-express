import { v2 as cld } from "cloudinary";
import { restaurantQueries } from "./DB/queries/restaurantQueries";
import { executeQuery } from "./DB/dbConfig";
import { Restaurant } from "../models/Restaurant";
import { PoolConnection } from "mysql2/promise";

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

  async updateImage(oldPublicId: string | undefined | null, filePath: string) {
    const data = await this.uploadImage(filePath);
    if (oldPublicId) await this.deleteImage(oldPublicId);
    return data;
  }
}

export const cloudinary = new Cloudinary();
