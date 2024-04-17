import React, { FormEvent, useRef } from "react";
import UpdateForm from "../../../RestaurantArea/OwnerOnly/UpdateForm";
import Input from "../../../Customs/Input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateRestaurantSchema } from "../../../../models/Restaurant";
import { menuItemService } from "../../../../services/menuItemService";
import { toastifyService } from "../../../../services/toastifyService";
import { updateMenuItemCache } from "../../../../utils/queryCacheUpdates/updateMenuItemCache";
import LoadingButton from "../../../Customs/LoadingButton";
import { MenuItemWOptions } from "../../../../models/MenuItem";

type UpdateMenuItemImageProps = {
  menuItem: MenuItemWOptions;
};

const UpdateMenuItemImage: React.FC<UpdateMenuItemImageProps> = ({
  menuItem,
}) => {
  const queryClient = useQueryClient();
  const imageRef = useRef<HTMLInputElement | null>(null);

  const { mutate, isPending } = useMutation({
    mutationFn: menuItemService.updateMenuItemImg,
    onSuccess(data) {
      updateMenuItemCache.updateMenuItemImg.onSuccess(queryClient, data);
    },
    onError: (error) => toastifyService.error(error),
  });

  const submitUpdate = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const image = imageRef.current?.files;
    if (!image) return;
    try {
      updateRestaurantSchema
        .pick({ image: true })
        .refine(({ image }) => image?.[0], "Image was not selected")
        .parse({ image });
      mutate({ id: menuItem.id, image, restaurantId: menuItem.restaurantId });
    } catch (error) {
      toastifyService.error(error as Error);
    }
  };

  return (
    <UpdateForm onSubmit={submitUpdate} formTitle="Update item image in menu">
      <Input
        label="Menu item Image:"
        type="file"
        ref={imageRef}
        disabled={isPending}
      />
      <LoadingButton
        type="submit"
        size={"formBtn"}
        variant={"primary"}
        disabled={isPending}
      >
        Update
      </LoadingButton>
    </UpdateForm>
  );
};

export default UpdateMenuItemImage;
