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
//for now data returns from axios is MenuItem, probably update to menuItemwith CategoryId and categoryName
class MenuItemService {
  async createMenuItem({
    restaurantId,
    description,
    extrasAmount,
    image,
    name,
    showSouces,
  }: PostItem): Promise<MenuItem> {
    const formData = new FormData();
    formData.append("restaurantId", restaurantId.toString());
    formData.append("description", description || "");
    formData.append("extrasAmount", extrasAmount);
    if (image) formData.append("image", image[0]);
    formData.append("name", name);
    formData.append("showSouces", showSouces);
    const { data } = await credentialsAxios.post(menuItemRoute, formData);
    return data;
  }

  async getMenuItemById(menuItemId: MenuItem["id"]) {
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
    return data;
  }

  async updateMenuItemApartFromImg({ id, ...rest }: UpdateApartFromImg) {
    const { data } = await credentialsAxios.put<
      MenuItem,
      AxiosResponse,
      Omit<UpdateApartFromImg, "id">
    >(`${menuItemRoute}/${id}`, rest);
    return data;
  }

  async updateMenuItemImg() {}
  async deleteMenuItem() {}
}

export const menuItemService = new MenuItemService();
