import { credentialsAxios } from "../utils/axiosConfig";

const menuItemCategoryRoute = "/menu-item-category";
type PostAssosiation = {
  menuItemId: number;
  categoryIds: number[];
  restaurantId: number;
};
class MenuItemCategory {
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
}

export const menuItemCategory = new MenuItemCategory();
