import { MenuItemOption } from "../models/MenuItemOption";
import { credentialsAxios } from "../utils/axiosConfig";

const menuItemOptionsRoute = "menu-item-options";
type OptionsObj = {
  restaurantId: number;
  menuItemId: number;
  options: string[];
};
class MenuItemOptionsService {
  async createOptions({
    restaurantId,
    ...options
  }: OptionsObj): Promise<MenuItemOption[]> {
    const route = `${menuItemOptionsRoute}/restaurant/${restaurantId}`;
    const { data } = await credentialsAxios.post<MenuItemOption[]>(
      route,
      options
    );
    return data;
  }

  async deleteOption(optionId: number, restaurantId: number) {
    const route = `${menuItemOptionsRoute}/${optionId}/restaurant/${restaurantId}`;
    const { data } = await credentialsAxios.delete(route);
    return data;
  }
}

export const menuItemOptionsService = new MenuItemOptionsService();
