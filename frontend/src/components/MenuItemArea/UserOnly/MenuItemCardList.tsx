import React from "react";
import {
  MenuItem,
  MenuItemsNestedInCategories,
} from "../../../models/MenuItem";
import useCustomQuery from "../../../hooks/useCustomQuery";
import { menuItemService } from "../../../services/menuItemService";
import queryKeys from "../../../utils/queryKeys";
import { generateCldResizedImage } from "../../../utils/cloudinaryConfig";
import { thumbnail } from "@cloudinary/url-gen/actions/resize";
import { AdvancedImage } from "@cloudinary/react";
import useScreenSize from "../../../hooks/useScreenSize";

type MenuItemCardListProps = {
  restaurantId: number;
};

const MenuItemCardList: React.FC<MenuItemCardListProps> = ({
  restaurantId,
}) => {
  const { data, isLoading, isError } = useCustomQuery({
    queryKey: queryKeys.menuItems.getMenuItemsByRestaurantId(restaurantId),
    queryFn: () =>
      menuItemService.getMenuItemByRestaurantId<false>(restaurantId),
  });
  return (
    <div>
      {isError && "error"}
      {isLoading && "Loading..."}
      {data && <Categories categories={data} />}
    </div>
  );
};

function Categories({
  categories,
}: {
  categories: MenuItemsNestedInCategories[];
}) {
  return categories.map((category, i) => (
    <Category category={category} key={i} />
  ));
}

function Category({ category }: { category: MenuItemsNestedInCategories }) {
  return (
    <>
      <h1 className="border-b font-bold text-xl">{category.name || "Meals"}</h1>
      {category.menuItems.map((item) => (
        <MenuItemCard menuItem={item} key={item.id} />
      ))}
    </>
  );
}

function MenuItemCard({ menuItem }: { menuItem: MenuItem }) {
  const isSmaller = useScreenSize("lg");
  const imgSize = isSmaller ? 100 : 150;
  const img = generateCldResizedImage(
    menuItem.imgPublicId,
    "logo",
    thumbnail().width(imgSize).height(imgSize)
  );

  return (
    <div className="border p-2 rounded-md flex gap-2 cursor-pointer">
      <AdvancedImage cldImg={img} className={"border-r"} />
      <div className="flex flex-col">
        <div className="font-semibold text-lg">{menuItem.name}</div>
        <div>{menuItem.description}</div>
      </div>
    </div>
  );
}

export default MenuItemCardList;
