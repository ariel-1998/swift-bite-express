import React, { forwardRef, useEffect } from "react";
import { AdvancedImage } from "@cloudinary/react";
import cld from "../../utils/cloudinaryConfig";
import { thumbnail } from "@cloudinary/url-gen/actions/resize";
// import useGenerateImg from "../../hooks/useGenerateImg";
import { CONSTANTS } from "../../utils/constants";
import { NestedRestauranAndAddress } from "../../models/Restaurant";
import { restaurantService } from "../../services/restaurantService";

type RestaurantCardProps = {
  restaurant: NestedRestauranAndAddress;
};

const RestaurantCard = forwardRef<HTMLDivElement, RestaurantCardProps>(
  ({ restaurant }, ref) => {
    //   const image = useGenerateImg({
    //     publicId,
    //     resize: thumbnail().width(300).height(200),
    //   });
    let img;
    if (!restaurant.imgPublicId) {
      // need to upload default image
      img = cld.image(CONSTANTS.DEFAULT_RESTAURANT_PUBLIC_ID);
    } else {
      img = cld.image(restaurant.imgPublicId);
    }
    img.resize(thumbnail().width(300).height(200));
    //   img.resize(resize);
    //   setImage(img);
    //   img = cld.image(CONSTANTS.DEFAULT_RESTAURANT_PUBLIC_ID);

    return (
      <div
        ref={ref}
        className="bg-white rounded transition-shadow hover:shadow-md w-52 h-40"
      >
        <AdvancedImage cldImg={img} />
        <div>hi</div>
      </div>
    );
  }
);

export default RestaurantCard;
