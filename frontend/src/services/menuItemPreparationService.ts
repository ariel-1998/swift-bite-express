import { MenuItemPreparationStyle } from "../models/MenuItemPreparationStyle";
import { credentialsAxios } from "../utils/axiosConfig";

const menuItemPreparationStyleRoute = "menu-item-preparation-style";

class MenuItemPreperationService {
  async createPreparationStyles({
    restaurantId,
    ...rest
  }: AddPreparationStylesObj): Promise<MenuItemPreparationStyle[]> {
    const route = `${menuItemPreparationStyleRoute}/restaurant/${restaurantId}`;
    const { data } = await credentialsAxios.post<MenuItemPreparationStyle[]>(
      route,
      rest
    );
    return data;
  }

  async deletePreparationStyle({
    preparationStyleId,
    restaurantId,
  }: DeletePreparationStyle) {
    const route = `${menuItemPreparationStyleRoute}/${preparationStyleId}/restaurant/${restaurantId}`;
    const { data } = await credentialsAxios.delete(route);
    return data;
  }
}

export const menuItemPreperationService = new MenuItemPreperationService();

type AddPreparationStylesObj = {
  restaurantId: number;
  menuItemId: number;
  preparationStyles: string[];
};
type DeletePreparationStyle = {
  preparationStyleId: number;
  restaurantId: number;
};
