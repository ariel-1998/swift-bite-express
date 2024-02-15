import { forwardRef } from "react";
import { AdvancedImage } from "@cloudinary/react";
import cld from "../../utils/cloudinaryConfig";
import { thumbnail } from "@cloudinary/url-gen/actions/resize";
// import useGenerateImg from "../../hooks/useGenerateImg";
import { CONSTANTS } from "../../utils/constants";
import { NestedRestaurantAndAddress } from "../../models/Restaurant";
import { CloudinaryImage } from "@cloudinary/url-gen/index";
import { Link } from "react-router-dom";

type RestaurantCardProps = {
  restaurant: NestedRestaurantAndAddress;
};

const RestaurantCard = forwardRef<HTMLAnchorElement, RestaurantCardProps>(
  ({ restaurant }, ref) => {
    //check if need hook in useEffect
    let img: CloudinaryImage;
    let logo: CloudinaryImage;
    if (!restaurant.imgPublicId) {
      // need to upload default image
      img = cld.image(CONSTANTS.DEFAULT_RESTAURANT_IMG_PUBLIC_ID);
    } else {
      img = cld.image(restaurant.imgPublicId);
    }
    img.resize(
      thumbnail()
        .width(288)
        .height((288 / 3) * 2)
    );

    if (!restaurant.logoPublicId) {
      logo = cld.image(CONSTANTS.DEFAULT_RESTAURANT_LOGO_PUBLIC_ID);
    } else {
      logo = cld.image(restaurant.logoPublicId);
    }
    logo.resize(thumbnail().width(50).height(50));

    return (
      <Link
        to={`/restaurants/${restaurant.id}`}
        ref={(e) => {
          //handle both function ref and object ref
          if (typeof ref === "function") {
            ref(e);
          } else if (ref) {
            ref.current = e;
          }
        }}
        className="bg-white rounded transition-shadow hover:shadow-md max-w-72 flex flex-col cursor-pointer"
      >
        <AdvancedImage cldImg={img} />
        <div className="flex gap-2">
          <AdvancedImage cldImg={logo} />
          <div className="flex flex-col">
            <span className="font-bold text-lg font-serif">
              {restaurant.name}
            </span>
            <span className="font-medium text-sm text-orange">
              {restaurant.address.state
                ? restaurant.address.state
                : restaurant.address.country}
            </span>
            <span className="font-normal  text-xs	text-gray-400">
              {restaurant.address.city}
            </span>
          </div>
        </div>
      </Link>
    );
  }
);

export default RestaurantCard;
