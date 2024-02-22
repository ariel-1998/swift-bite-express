import { MenuItem } from "../../../models/MenuItem";
import { TurnUndefinedToNullInObj } from "../../helperFunctions";
import { MixedArray, TransactionQuery } from "../dbConfig";
import { DB } from "../tables";

type MenuItemQuery = TurnUndefinedToNullInObj<MenuItem>;
////////// need to add join in get request as it should also contain the category it belongs to
const {
  tableName,
  columns: {
    id,
    name,
    description,
    imgPublicId,
    extrasAmount,
    showSouces,
    restaurantId,
  },
} = DB.tables.menu_items;

class MenuItemsQueries {
  createMenuItem(menuItem: Omit<MenuItemQuery, "id">): TransactionQuery {
    const query = `
      INSERT INTO ${tableName} 
      (${restaurantId}, ${name}, ${description}, ${imgPublicId}, ${extrasAmount}, ${showSouces})
      VALUES(?,?,?,?,?,?)`;

    const params: MixedArray = [
      menuItem.restaurantId,
      menuItem.name,
      menuItem.description,
      menuItem.imgPublicId,
      menuItem.extrasAmount,
      menuItem.showSouces,
    ];
    return { params, query };
  }

  updateMenuItemImg(
    item: Pick<MenuItemQuery, "id" | "imgPublicId" | "restaurantId">
  ): TransactionQuery {
    const query = `
    UPDATE ${tableName} 
    SET ${imgPublicId} = ?
    WHERE ${id} = ? AND ${restaurantId} = ?`;
    const params: MixedArray = [item.imgPublicId, item.id, item.restaurantId];
    return { params, query };
  }

  updateMenuItemApartFromImg(
    menuItem: Omit<MenuItemQuery, "imgPublicId">
  ): TransactionQuery {
    const query = `
    UPDATE ${tableName} 
    SET ${name} = ?,
    ${description} = ?,
    ${extrasAmount} = ?,
    ${showSouces} = ?
    WHERE ${id} = ? And ${restaurantId} = ?
    `;
    const params: MixedArray = [
      menuItem.name,
      menuItem.description,
      menuItem.extrasAmount,
      menuItem.showSouces,
      menuItem.id,
      menuItem.restaurantId,
    ];
    return { params, query };
  }

  getMenuItemById(menuItemId: number): TransactionQuery {
    const query = `SELECT * FROM ${tableName} WHERE ${id} = ?`;
    const params: MixedArray = [menuItemId];
    return { params, query };
  }

  deleteMenuItem(menuItemId: number, restId: number): TransactionQuery {
    const query = `DELETE FROM ${tableName} WHERE ${id} = ? AND ${restaurantId} = ?`;
    const params: MixedArray = [menuItemId, restId];
    return { params, query };
  }
}

export const menuItemsQueries = new MenuItemsQueries();
