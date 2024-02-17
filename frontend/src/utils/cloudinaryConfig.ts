import { Cloudinary } from "@cloudinary/url-gen";
import { CONSTANTS } from "./constants";
import { ResizeSimpleAction } from "@cloudinary/url-gen/actions/resize/ResizeSimpleAction";

export const cld = new Cloudinary({
  cloud: {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  },
  url: {
    secure: true, // force https, set to false to force http
  },
});

type DefaultPublicId = "logo" | "image";
export function generateCldResizedImage(
  publicId: string | undefined | null,
  type: DefaultPublicId,
  resize: ResizeSimpleAction
) {
  // type = image
  let cldPublicId: string;
  if (type === "image") {
    cldPublicId = publicId
      ? publicId
      : CONSTANTS.DEFAULT_RESTAURANT_IMG_PUBLIC_ID;
  } else {
    cldPublicId = publicId
      ? publicId
      : CONSTANTS.DEFAULT_RESTAURANT_LOGO_PUBLIC_ID;
  }
  const image = cld.image(cldPublicId);
  console.log(cldPublicId);
  const resizedImg = image.resize(resize);
  return resizedImg;
}
