import React from "react";
import { MenuItemWCategoryAndOptions } from "../../../models/MenuItem";
import useCustomQuery from "../../../hooks/useCustomQuery";
import { menuItemService } from "../../../services/menuItemService";
import queryKeys from "../../../utils/queryKeys";
import { generateCldResizedImage } from "../../../utils/cloudinaryConfig";
import { thumbnail } from "@cloudinary/url-gen/actions/resize";
import { AdvancedImage } from "@cloudinary/react";
import useScreenSize from "../../../hooks/useScreenSize";
import { Category } from "../../../models/Category";
import { Link } from "react-router-dom";

type MenuItemCardListProps = {
  restaurantId: number;
};

const MenuItemCardList: React.FC<MenuItemCardListProps> = ({
  restaurantId,
}) => {
  const { data, isLoading, isError } = useCustomQuery({
    queryKey: queryKeys.menuItems.getMenuItemsByRestaurantId(restaurantId),
    queryFn: () =>
      menuItemService.getMenuItemByRestaurantId(restaurantId, false),
  });
  return (
    <div className="mx-2 sm:mx-4">
      {isError && "error"}
      {isLoading && "Loading..."}
      {data &&
        data.map((item, i) => {
          const lastItem = data[i - 1] || null;
          if (item.category?.id !== lastItem?.category?.id || !lastItem) {
            return (
              <div key={`${item.category?.id}${item.id}`}>
                <CategoryCard category={item.category} />
                <MenuItemCard menuItem={item} />
              </div>
            );
          }
          return (
            <MenuItemCard
              key={`${item.category?.id}${item.id}`}
              menuItem={item}
            />
          );
        })}
    </div>
  );
};
function CategoryCard({ category }: { category: Category | null }) {
  return (
    <h1 className="my-4 sm:my-6 p-3 px-6 font-extrabold text-xl bg-white shadow-md rounded-md">
      {category?.name || "Meals"}
    </h1>
  );
}

function MenuItemCard({ menuItem }: { menuItem: MenuItemWCategoryAndOptions }) {
  const isSmaller = useScreenSize("lg");
  const imgSize = isSmaller ? 100 : 150;
  const img = generateCldResizedImage(
    menuItem.imgPublicId,
    "logo",
    thumbnail().width(imgSize).height(imgSize)
  );
  return (
    //overflow hidden if image overflows
    <Link
      to=""
      className="bg-white shadow-md my-2 sm:my-4 rounded-md flex gap-2 cursor-pointer"
    >
      <AdvancedImage cldImg={img} />
      <div className={`flex flex-col justy-between mx-2 p-2 relative grow`}>
        <div className="flex items-center justify-between ">
          <div className="font-bold text-lg">{menuItem.name}</div>
          <div className="font-semibold">${menuItem.price}</div>
        </div>
        <div className="text-secondary-text">{menuItem.description}</div>
      </div>
    </Link>
  );
}

export default MenuItemCardList;
