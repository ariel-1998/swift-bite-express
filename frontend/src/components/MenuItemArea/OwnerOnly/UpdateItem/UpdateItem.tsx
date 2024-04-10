import React, { useState } from "react";
import useCustomQuery from "../../../../hooks/useCustomQuery";
import queryKeys from "../../../../utils/queryKeys";
import { menuItemService } from "../../../../services/menuItemService";
import OwnerMenuItemCard from "../OwnerMenuItemCard";
import UpdateMenuItemImage from "./UpdateMenuItemImage";
import UpdateMenuItemDetails from "./UpdateMenuItemDetails";
import { CategoriesNestedInMenuItem } from "../../../../models/MenuItem";
import { updateMenuItemCache } from "../../../../utils/queryCacheUpdates/updateMenuItemCache";
import { useQueryClient } from "@tanstack/react-query";
import UpdateMenuItemCategoryAssociation from "./UpdateMenuItemCategoryAssociation";
import Modal from "../../../Customs/Modal";

type UpdateType = "image" | "details" | "association" | null;
type UpdateItemProps = {
  restaurantId: number;
};

const UpdateItem: React.FC<UpdateItemProps> = ({ restaurantId }) => {
  //need to check that the right format returns for user and owner each with different type
  const queryClient = useQueryClient();
  const [selectedItem, setSelectedItem] =
    useState<CategoriesNestedInMenuItem | null>(null);

  const { data, isLoading, isError } = useCustomQuery({
    queryKey: queryKeys.menuItems.getMenuItemsByRestaurantId(restaurantId),
    queryFn: () =>
      menuItemService.getMenuItemByRestaurantId(restaurantId, true),
  });

  const cacheItemOnClick = (item: CategoriesNestedInMenuItem) => {
    updateMenuItemCache.setSingleItemQueryDataOnClick(queryClient, item);
    setSelectedItem(item);
  };
  console.log(data);
  return (
    <div>
      {isLoading && <div>Loading...</div>}
      {isError && <div>Error</div>}

      {data &&
        data.map((item) => (
          <OwnerMenuItemCard
            key={item.id}
            menuItem={item}
            onClick={() => cacheItemOnClick(item)}
          />
        ))}

      {selectedItem && (
        <UpdateSelection
          // restaurantId={restaurantId}
          menuItem={selectedItem}
          deselectItem={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
};

type UpdateSelectionProps = {
  menuItem: CategoriesNestedInMenuItem;
  deselectItem(): void;
};
function UpdateSelection({ menuItem, deselectItem }: UpdateSelectionProps) {
  const [updateType, setUpdateType] = useState<UpdateType>("details");

  return (
    <Modal close={deselectItem}>
      <div className="flex flex-col sm:w-[400px] w-full">
        <ul className="flex font-bold justify-around mb-5 divide-x divide-solid">
          <Li
            formName={"details"}
            setUpdateType={setUpdateType}
            activeForm={updateType}
          />
          <Li
            formName={"image"}
            setUpdateType={setUpdateType}
            activeForm={updateType}
          />
          <Li
            formName={"association"}
            setUpdateType={setUpdateType}
            activeForm={updateType}
          />
        </ul>
        {updateType === "details" ? (
          <UpdateMenuItemDetails item={menuItem} />
        ) : updateType === "image" ? (
          <UpdateMenuItemImage menuItem={menuItem} />
        ) : updateType === "association" ? (
          <UpdateMenuItemCategoryAssociation menuItem={menuItem} />
        ) : null}
      </div>
    </Modal>
  );
}

type LiProps = {
  setUpdateType: (type: UpdateType) => void;
  formName: UpdateType;
  activeForm: UpdateType;
};
function Li({ formName, setUpdateType, activeForm }: LiProps) {
  return (
    <li
      onClick={() => {
        if (activeForm === formName) return;
        setUpdateType(formName);
      }}
      className={`grow hover:bg-secondary p-2 transition-colors text-center inline-block
${
  activeForm === formName
    ? "bg-secondary cursor-default"
    : "hover:bg-secondary cursor-pointer"
}`}
    >
      {formName}
    </li>
  );
}

export default UpdateItem;
