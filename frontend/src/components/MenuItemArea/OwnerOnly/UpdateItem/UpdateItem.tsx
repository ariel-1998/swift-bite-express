import React, { useMemo } from "react";
import useCustomQuery from "../../../../hooks/useCustomQuery";
import queryKeys from "../../../../utils/queryKeys";
import { menuItemService } from "../../../../services/menuItemService";
import { Category } from "../../../../models/Category";

type UpdateItemProps = {
  restaurantId: number;
};

const UpdateItem: React.FC<UpdateItemProps> = ({ restaurantId }) => {
  const { data } = useCustomQuery({
    queryKey: queryKeys.menuItems.getMenuItemByRestaurantId(restaurantId),
    queryFn: () =>
      menuItemService.getMenuItemByRestaurantId(restaurantId, true),
  });

  //   const memoData = useMemo(() => {
  //     return data
  //       ?.filter((mi) => mi.categoryId && mi.categoryName)
  //       .map((mi) => {
  //         return {
  //           id: mi.categoryId, //check if always is defined
  //           name: mi.categoryName, //check if always is defined
  //           description: mi.categoryDescription,
  //           restaurantId: mi.restaurantId,
  //         } as Category;
  //       });
  //   }, [data]);
  return (
    <div>
      <div></div>
    </div>
  );
};

export default UpdateItem;
