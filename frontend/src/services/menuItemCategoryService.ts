import { credentialsAxios } from "../utils/axiosConfig";

const menuItemCategoryRoute = "/menu-item-category";
type PostAssosiation = {
  menuItemId: number;
  categoryIds: number[];
  restaurantId: number;
};
class MenuItemCategoryService {
  async createMenuItemCategoryRef({
    categoryIds,
    menuItemId,
    restaurantId,
  }: PostAssosiation) {
    const { status } = await credentialsAxios.post(
      `${menuItemCategoryRoute}/restaurant/${restaurantId}/menu-item/${menuItemId}`,
      categoryIds
    );
    return status;
  }
  async updateMenuItemCategoryRef({
    categoryIds,
    menuItemId,
    restaurantId,
  }: PostAssosiation) {
    const { status } = await credentialsAxios.put(
      `${menuItemCategoryRoute}/restaurant/${restaurantId}/menu-item/${menuItemId}`,
      categoryIds
    );
    return status;
  }
}

export const menuItemCategoryService = new MenuItemCategoryService();
