import React from "react";
import { NestedRestaurantAndAddress } from "../../models/Restaurant";
import { scale, thumbnail } from "@cloudinary/url-gen/actions/resize";
import { generateCldResizedImage } from "../../utils/cloudinaryConfig";
import { AdvancedImage } from "@cloudinary/react";

type RestaurantHeaderImgProps = {
  restaurant: NestedRestaurantAndAddress;
};

const RestaurantHeaderImg: React.FC<RestaurantHeaderImgProps> = ({
  restaurant,
}) => {
  const headerHeight = 600;
  const image = generateCldResizedImage(
    restaurant.imgPublicId,
    "image",
    scale().width("auto").height(headerHeight)
  )
    .quality("auto")
    .format("auto");

  const logo = generateCldResizedImage(
    restaurant.logoPublicId,
    "logo",
    thumbnail().width(120).height(100)
  );

  return (
    <div className="relative flex">
      <AdvancedImage
        cldImg={image}
        className="w-screen restaurant-header-img "
      />
      <div className="absolute inset-0 flex justify-center items-center">
        <div className="bg-opacity-50 bg-white px-20 p-2 flex flex-col gap-2 rounded items-center justify-center">
          <AdvancedImage cldImg={logo} className="restaurant-header-logo" />
          <span className="font-extrabold italic text-2xl	">
            {restaurant.name}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RestaurantHeaderImg;
