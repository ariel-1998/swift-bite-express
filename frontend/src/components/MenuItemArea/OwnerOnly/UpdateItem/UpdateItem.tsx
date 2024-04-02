import React, { useState } from "react";
import useCustomQuery from "../../../../hooks/useCustomQuery";
import queryKeys from "../../../../utils/queryKeys";
import { menuItemService } from "../../../../services/menuItemService";
import OwnerMenuItemCard from "../OwnerMenuItemCard";
import UpdateMenuItemImage from "./UpdateMenuItemImage";
import UpdateMenuItemDetails from "./UpdateMenuItemDetails";
import { MenuItem } from "../../../../models/MenuItem";
import { updateMenuItemCache } from "../../../../utils/queryCacheUpdates/updateMenuItemCache";
import { useQueryClient } from "@tanstack/react-query";
import UpdateMenuItemCategoryAssociation from "./UpdateMenuItemCategoryAssociation";
import Modal from "../../../Customs/Modal";
import Select from "../../../Customs/Select";

type UpdateType = "image" | "details" | "association" | null;
type UpdateItemProps = {
  restaurantId: number;
};

const UpdateItem: React.FC<UpdateItemProps> = ({ restaurantId }) => {
  //need to check that the right format returns for user and owner each with different type
  const queryClient = useQueryClient();
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  // const deselectItem = () => setSelectedItem(null);

  const { data, isLoading, isError } = useCustomQuery({
    queryKey: queryKeys.menuItems.getMenuItemsByRestaurantId(restaurantId),
    queryFn: () =>
      menuItemService.getMenuItemByRestaurantId(restaurantId, true),
  });

  const cacheItemOnClick = (item: MenuItem) => {
    updateMenuItemCache.setSingleItemQueryDataOnClick(queryClient, item);
    setSelectedItemId(item.id);
  };

  return (
    <div>
      {isLoading && <div>Loading...</div>}
      {isError && <div>Error</div>}

      {data &&
        data.map((item) => (
          <OwnerMenuItemCard
            menuItem={item}
            onClick={() => cacheItemOnClick(item)}
          />
        ))}

      {selectedItemId && (
        <UpdateSelection
          itemId={selectedItemId}
          deselectItem={() => setSelectedItemId(null)}
        />
      )}

      {/* 
      {update === "image" && selectedItemId && <UpdateMenuItemImage />}
      {update === "association" && selectedItemId && (
        <UpdateMenuItemCategoryAssociation />
      )} */}

      {/* <div onClick={deselectItem} className="text-center">
        Back to list
      </div> */}
    </div>
  );
};

type UpdateSelectionProps = {
  // setUpdateType: React.Dispatch<React.SetStateAction<UpdateType>>;
  // updateType: UpdateType;
  itemId: number;
  deselectItem(): void;
};
function UpdateSelection({
  // setUpdateType,
  // updateType,
  itemId,
  deselectItem,
}: UpdateSelectionProps) {
  const [updateType, setUpdateType] = useState<UpdateType>(null);

  const { data: item, isLoading } = useCustomQuery({
    queryKey: queryKeys.menuItems.getMenuItemById(itemId),
    queryFn: () => menuItemService.getMenuItemById(itemId),
  });

  return (
    <Modal close={deselectItem}>
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

      {updateType && isLoading && <div>Loading...</div>}
      {updateType && item ? (
        updateType === "details" ? (
          <UpdateMenuItemDetails item={item} />
        ) : updateType === "image" ? (
          <UpdateMenuItemImage />
        ) : updateType === "association" ? (
          <UpdateMenuItemCategoryAssociation />
        ) : null
      ) : null}
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
      className={`grow hover:bg-secondary p-2 transition-colors text-center
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
