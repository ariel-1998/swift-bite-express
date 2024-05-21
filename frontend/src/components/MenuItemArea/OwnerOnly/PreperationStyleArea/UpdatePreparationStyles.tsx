import React, { FormEvent, useState } from "react";
import UpdateForm from "../../../RestaurantArea/OwnerOnly/UpdateForm";
import AddPreperationStyleToItem from "./AddPreperationStyleToItem";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MenuItemWPreparationStyles } from "../../../../models/MenuItem";
import LoadingButton from "../../../Customs/LoadingButton";
import { menuItemPreperationService } from "../../../../services/menuItemPreparationService";
import HorizontalListItem from "../../../Customs/HorizontalListItem";
import HorizontalList from "../../../Customs/HorizontalList";
import { updateMenuItemCache } from "../../../../utils/queryCacheUpdates/updateMenuItemCache";
import useCustomQuery from "../../../../hooks/useCustomQuery";
import queryKeys from "../../../../utils/queryKeys";
import { menuItemService } from "../../../../services/menuItemService";
import { toastifyService } from "../../../../services/toastifyService";

type UpdatePreparationStylesProps = {
  menuItemId: number;
};

const UpdatePreparationStyles: React.FC<UpdatePreparationStylesProps> = ({
  menuItemId,
}) => {
  const { data: menuItem, isLoading } = useCustomQuery({
    queryKey: queryKeys.menuItems.getMenuItemById(menuItemId),
    queryFn: () => menuItemService.getMenuItemById(menuItemId),
    onError: () =>
      toastifyService.error({ message: "Menu Item was not found" }),
  });
  return (
    <div>
      <div>{isLoading && "Loading..."}</div>
      {menuItem && <RemovePreparationStyle menuItem={menuItem} />}
      <hr />
      {menuItem && <AddPreperationStyles menuItem={menuItem} />}
    </div>
  );
};

export default UpdatePreparationStyles;

type UpdateStylesProps = {
  menuItem: MenuItemWPreparationStyles;
};
function RemovePreparationStyle({ menuItem }: UpdateStylesProps) {
  const queryClient = useQueryClient();
  const { mutate: deleteMutate } = useMutation({
    mutationFn: menuItemPreperationService.deletePreparationStyle,
    onMutate: ({ preparationStyleId, restaurantId }) => {
      toastifyService.success("Successfuly removed!");
      return updateMenuItemCache.updateMenuItemPreparation.deletePreparationStyle.onMutate(
        queryClient,
        menuItem.id,
        restaurantId,
        preparationStyleId
      );
    },
    onError(error, _, context) {
      updateMenuItemCache.updateMenuItemPreparation.deletePreparationStyle.onError(
        error,
        context,
        queryClient
      );
    },
  });

  const removeStyle = (preparationStyleId: number) => {
    if (!menuItem) return;
    deleteMutate({ preparationStyleId, restaurantId: menuItem.restaurantId });
  };

  return (
    <div className="px-10 py-5 m-0">
      {menuItem.preparationStyles.length > 0 ? (
        <>
          <div>Remove Preparation Styles:</div>
          <ul>
            <HorizontalList>
              {menuItem.preparationStyles.map((sty) => (
                <HorizontalListItem
                  key={sty.id}
                  output={sty.name}
                  onClick={() => removeStyle(sty.id)}
                />
              ))}
            </HorizontalList>
          </ul>
        </>
      ) : (
        "Preparation styles were not created"
      )}
    </div>
  );
}

function AddPreperationStyles({ menuItem }: UpdateStylesProps) {
  const [styles, setStyles] = useState<string[]>([]);
  const queryClient = useQueryClient();
  const { isPending, mutate: addMutate } = useMutation({
    mutationFn: menuItemPreperationService.createPreparationStyles,
    onSuccess(data) {
      setStyles([]);
      toastifyService.success("Successfuly Added!");
      updateMenuItemCache.updateMenuItemPreparation.createPreparationStyles.onSucsess(
        queryClient,
        menuItem.id,
        menuItem.restaurantId,
        data
      );
    },
    onError: (err) => toastifyService.error(err),
  });

  const addStyles = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!styles.length || !menuItem) return;
    const filteredStyles = styles.filter((style) =>
      menuItem.preparationStyles.findIndex((sty) => sty.name === style)
    );
    addMutate({
      menuItemId: menuItem.id,
      restaurantId: menuItem.restaurantId,
      preparationStyles: filteredStyles,
    });
  };

  return (
    <UpdateForm onSubmit={addStyles}>
      <AddPreperationStyleToItem
        label="Add New Preparation Styles:"
        styles={styles}
        setStyles={setStyles}
      />
      <LoadingButton
        type="submit"
        size={"formBtn"}
        variant={"primary"}
        disabled={isPending}
      >
        Apply changes
      </LoadingButton>
    </UpdateForm>
  );
}
