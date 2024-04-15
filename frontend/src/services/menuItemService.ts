import { credentialsAxios, defaultAxios } from "../utils/axiosConfig";
import {
  CategoriesNestedInMenuItem,
  MenuItem,
  MenuItemForm,
  MenuItemsNestedInCategories,
} from "../models/MenuItem";
import { AxiosResponse } from "axios";

const menuItemRoute = "/menu-item";

type PostItem = MenuItemForm & Pick<MenuItem, "restaurantId">;
type UpdateApartFromImg = Omit<MenuItem, "imgPublicId">;
type UpdateImage = Pick<MenuItem, "id" | "restaurantId"> & {
  image: FileList;
};
//for now data returns from axios is MenuItem, probably update to menuItemwith CategoryId and categoryName
class MenuItemService {
  async createMenuItem({
    restaurantId,
    description,
    extrasAmount,
    image,
    name,
    price,
    showSouces,
    drinksAmount,
  }: PostItem): Promise<MenuItem> {
    const formData = new FormData();
    formData.append("restaurantId", restaurantId.toString());
    formData.append("description", description || "");
    formData.append("extrasAmount", extrasAmount);
    formData.append("drinksAmount", drinksAmount);
    formData.append("price", price);
    if (image) formData.append("image", image[0]);
    formData.append("name", name);
    formData.append("showSouces", showSouces);
    const { data } = await credentialsAxios.post(menuItemRoute, formData);
    return data;
  }

  async getMenuItemById(menuItemId: MenuItem["id"]): Promise<MenuItem> {
    const { data } = await defaultAxios.get<MenuItem>(
      `${menuItemRoute}/${menuItemId}`
    );
    return data;
  }

  async getMenuItemByRestaurantId<T extends boolean>(
    restaurantId: MenuItem["restaurantId"],
    isOwner: T
  ) {
    const params = isOwner ? { isOwner: true } : {};
    const { data } = await defaultAxios.get<
      typeof isOwner extends true
        ? CategoriesNestedInMenuItem[]
        : MenuItemsNestedInCategories[]
    >(`${menuItemRoute}/restaurant/${restaurantId}`, { params });
    console.log("dataasdasdasd", data);
    return data;
  }

  async updateMenuItemApartFromImg({
    id,
    ...rest
  }: UpdateApartFromImg): Promise<MenuItem> {
    const { data } = await credentialsAxios.put<
      MenuItem,
      AxiosResponse,
      Omit<UpdateApartFromImg, "id">
    >(`${menuItemRoute}/${id}`, rest);
    return data;
  }

  async updateMenuItemImg({
    id,
    restaurantId,
    image,
  }: UpdateImage): Promise<MenuItem> {
    const formData = new FormData();
    formData.append("restaurantId", restaurantId.toString());
    formData.append("image", image[0]);
    const { data } = await credentialsAxios.put<MenuItem>(
      `${menuItemRoute}/${id}/image`,
      formData
    );
    return data;
  }
  async deleteMenuItem() {}
}

export const menuItemService = new MenuItemService();
