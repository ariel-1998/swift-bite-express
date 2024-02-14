import { useEffect, useState } from "react";
import cld from "../utils/cloudinaryConfig";
import { ResizeSimpleAction } from "@cloudinary/url-gen/actions/resize/ResizeSimpleAction";
import { CloudinaryImage } from "@cloudinary/url-gen/index";
import { CONSTANTS } from "../utils/constants";

type UseGenerateImgProps = {
  publicId?: string;
  resize: ResizeSimpleAction;
};

const useGenerateImg = ({
  publicId,
  resize,
}: UseGenerateImgProps): CloudinaryImage | undefined => {
  const [image, setImage] = useState<CloudinaryImage>();
  useEffect(() => {
    let img: CloudinaryImage;
    if (!publicId) {
      // need to upload default image
      img = cld.image(CONSTANTS.DEFAULT_RESTAURANT_PUBLIC_ID);
    } else {
      img = cld.image(publicId);
    }
    img.resize(resize);
    setImage(img);
  }, [publicId, resize]);
  return image;
};

export default useGenerateImg;
