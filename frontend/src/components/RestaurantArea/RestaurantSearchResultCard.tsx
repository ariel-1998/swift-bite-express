import { forwardRef } from "react";
import { Restaurant } from "../../models/Restaurant";
import { Link } from "react-router-dom";
import { AdvancedImage } from "@cloudinary/react";
import { generateCldResizedImage } from "../../utils/cloudinaryConfig";
import { thumbnail } from "@cloudinary/url-gen/actions/resize";

type RestaurantSearchResultCardProps = {
  restaurant: Restaurant;
};

const RestaurantSearchResultCard = forwardRef<
  HTMLAnchorElement,
  RestaurantSearchResultCardProps
>(({ restaurant }, ref) => {
  const img = generateCldResizedImage(
    restaurant.logoPublicId,
    "logo",
    thumbnail().width(50).height(50)
  );
  return (
    <Link
      ref={(e) => {
        if (typeof ref === "function") {
          ref(e);
        } else if (ref) {
          ref.current = e;
        }
      }}
      to={`/restaurants/${restaurant.id}`}
    >
      <div className="flex bg-inherit hover:bg-primary transition-colors z-30 p-2">
        <AdvancedImage cldImg={img} />
        <div>{restaurant.name}</div>
      </div>
    </Link>
  );
});

export default RestaurantSearchResultCard;
