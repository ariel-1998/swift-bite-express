import { credentialsAxios, defaultAxios } from "../utils/axiosConfig";
import {
  CategoriesNestedInMenuItem,
  MenuItem,
  MenuItemForm,
  MenuItemWCategoryAndPreparationStyles,
  MenuItemWPreparationStyles,
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
  }: PostItem): Promise<MenuItemWPreparationStyles> {
    const formData = new FormData();
    formData.append("restaurantId", restaurantId.toString());
    formData.append("description", description || "");
    formData.append("extrasAmount", extrasAmount);
    formData.append("drinksAmount", drinksAmount);
    formData.append("price", price);
    if (image) formData.append("image", image[0]);
    formData.append("name", name);
    formData.append("showSouces", showSouces);
    const { data } = await credentialsAxios.post<MenuItemWPreparationStyles>(
      menuItemRoute,
      formData
    );
    return data;
  }

  async getMenuItemById(
    menuItemId: MenuItem["id"]
  ): Promise<MenuItemWPreparationStyles> {
    const { data } = await defaultAxios.get<MenuItemWPreparationStyles>(
      `${menuItemRoute}/${menuItemId}`
    );
    return data;
  }

  async getMenuItemByRestaurantId(
    restaurantId: MenuItem["restaurantId"],
    isOwner: true
  ): Promise<CategoriesNestedInMenuItem[]>;

  async getMenuItemByRestaurantId(
    restaurantId: MenuItem["restaurantId"],
    isOwner: false
  ): Promise<MenuItemWCategoryAndPreparationStyles[]>;

  async getMenuItemByRestaurantId(
    restaurantId: MenuItem["restaurantId"],
    isOwner: boolean
  ): Promise<
    CategoriesNestedInMenuItem[] | MenuItemWCategoryAndPreparationStyles[]
  > {
    const route = `${menuItemRoute}/restaurant/${restaurantId}`;
    if (isOwner) {
      const { data } = await credentialsAxios.get<CategoriesNestedInMenuItem[]>(
        route
      );
      return data;
    } else {
      const { data } = await defaultAxios.get<
        MenuItemWCategoryAndPreparationStyles[]
      >(route);
      return data;
    }
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
  }: UpdateImage): Promise<MenuItemWPreparationStyles> {
    const formData = new FormData();
    formData.append("restaurantId", restaurantId.toString());
    formData.append("image", image[0]);
    const { data } = await credentialsAxios.put<MenuItemWPreparationStyles>(
      `${menuItemRoute}/${id}/image`,
      formData
    );
    return data;
  }
  async deleteMenuItem() {}
}

export const menuItemService = new MenuItemService();
