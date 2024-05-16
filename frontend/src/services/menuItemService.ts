import { credentialsAxios, defaultAxios } from "../utils/axiosConfig";
import {
  CategoriesNestedInMenuItem,
  MenuItem,
  MenuItemForm,
  MenuItemWCategoryAndOptions,
  MenuItemWOptions,
} from "../models/MenuItem";

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
  }: PostItem): Promise<MenuItemWOptions> {
    const formData = new FormData();
    formData.append("restaurantId", restaurantId.toString());
    formData.append("description", description || "");
    formData.append("extrasAmount", extrasAmount);
    formData.append("drinksAmount", drinksAmount);
    formData.append("price", price);
    if (image) formData.append("image", image[0]);
    formData.append("name", name);
    formData.append("showSouces", showSouces);
    const { data } = await credentialsAxios.post<MenuItemWOptions>(
      menuItemRoute,
      formData
    );
    return data;
  }

  async getMenuItemById(menuItemId: MenuItem["id"]): Promise<MenuItemWOptions> {
    const { data } = await defaultAxios.get<MenuItemWOptions>(
      `${menuItemRoute}/${menuItemId}`
    );
    return data;
  }

  async getMenuItemByRestaurantId(
    restaurantId: MenuItem["restaurantId"],
    isOwner: boolean
  ) {
    const route = `${menuItemRoute}/restaurant/${restaurantId}`;
    let returnedData:
      | CategoriesNestedInMenuItem[]
      | MenuItemWCategoryAndOptions[];
    if (isOwner) {
      const { data } = await credentialsAxios.get<CategoriesNestedInMenuItem[]>(
        route
      );
      returnedData = data;
    } else {
      const { data } = await defaultAxios.get<MenuItemWCategoryAndOptions[]>(
        route
      );
      returnedData = data;
    }
    return returnedData;
  }

  async updateMenuItemApartFromImg({
    id,
    ...rest
  }: UpdateApartFromImg): Promise<void> {
    await credentialsAxios.put<undefined>(`${menuItemRoute}/${id}`, rest);
  }

  async updateMenuItemImg({
    id,
    restaurantId,
    image,
  }: UpdateImage): Promise<MenuItemWOptions> {
    const formData = new FormData();
    formData.append("restaurantId", restaurantId.toString());
    formData.append("image", image[0]);
    const { data } = await credentialsAxios.put<MenuItemWOptions>(
      `${menuItemRoute}/${id}/image`,
      formData
    );
    return data;
  }
  async deleteMenuItem() {}
}

export const menuItemService = new MenuItemService();
