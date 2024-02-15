import { forwardRef } from "react";
import { Restaurant } from "../../models/Restaurant";
import { Link } from "react-router-dom";

type RestaurantSearchResultCardProps = {
  restaurant: Restaurant;
};

const RestaurantSearchResultCard = forwardRef<
  HTMLAnchorElement,
  RestaurantSearchResultCardProps
>(({ restaurant }, ref) => {
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
      {restaurant.name} {restaurant.id}
    </Link>
  );
});

export default RestaurantSearchResultCard;
