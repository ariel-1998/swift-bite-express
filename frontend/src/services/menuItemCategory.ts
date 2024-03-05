import { MenuItemCategoryTable } from "../models/MenuItemCategoryTable";
import { credentialsAxios } from "../utils/axiosConfig";

const menuItemCategoryRoute = "/menu-item-categor";
class MenuItemCategory {
  async createMenuItemCategoryRef(refs: MenuItemCategoryTable[]) {
    const { data } = await credentialsAxios.post(menuItemCategoryRoute, refs);
    return data;
  }
}

export const menuItemCategory = new MenuItemCategory();
