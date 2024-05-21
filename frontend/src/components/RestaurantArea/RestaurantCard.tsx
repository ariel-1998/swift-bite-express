import { forwardRef } from "react";
import { AdvancedImage } from "@cloudinary/react";
import { thumbnail } from "@cloudinary/url-gen/actions/resize";
import { NestedRestaurantAndAddress } from "../../models/Restaurant";
import { Link } from "react-router-dom";
import { generateCldResizedImage } from "../../utils/cloudinaryConfig";

type RestaurantCardProps = {
  restaurant: NestedRestaurantAndAddress;
  navigateOnClick: string;
};

const RestaurantCard = forwardRef<HTMLAnchorElement, RestaurantCardProps>(
  ({ restaurant, navigateOnClick }, ref) => {
    //check if need hook in useEffect
    const img = generateCldResizedImage(
      restaurant.imgPublicId,
      "image",
      thumbnail()
        .width(288)
        .height((288 / 3) * 2)
    );
    const logo = generateCldResizedImage(
      restaurant.logoPublicId,
      "logo",
      thumbnail().width(50).height(50)
    );

    return (
      <Link
        to={navigateOnClick}
        ref={ref}
        // ref={(e) => {
        //   //handle both function ref and object ref
        //   if (typeof ref === "function") {
        //     ref(e);
        //   } else if (ref) {
        //     ref.current = e;
        //   }
        // }}
        className="bg-white rounded transition-shadow hover:shadow-md min-w-64 max-w-80 flex 
        overflow-hidden flex-col cursor-pointer grow h-fit pb-1"
      >
        <AdvancedImage cldImg={img} />
        <div className="flex gap-2 px-0.5">
          <AdvancedImage cldImg={logo} />
          <div className="flex flex-col ">
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
