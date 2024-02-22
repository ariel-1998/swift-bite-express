import { MenuItemCategoryTable } from "../../../models/MenuItemCategoryTable";
import { MixedArray, TransactionQuery } from "../dbConfig";
import { DB } from "../tables";

const {
  columns: { categoryId, menuItemId, restaurantId },
  tableName,
} = DB.tables.menu_items_category;

type MenuItemCategoryUpdateQuery = MenuItemCategoryTable & {
  oldCategoryId: number;
};

class MenuItemCategoryQueries {
  createMenuItemCategoryRef(row: MenuItemCategoryTable): TransactionQuery {
    const { columns: categoryCols, tableName: categories } =
      DB.tables.categories;
    const { columns: itemCols, tableName: menuItems } = DB.tables.menu_items;
    const query = `INSERT INTO ${tableName} 
    (${categoryId}, ${menuItemId}, ${restaurantId})
    SELECT ?, ?, ?
    FROM ${categories}
    JOIN ${menuItems} 
    ON ${categories}.${categoryCols.restaurantId} = ${menuItems}.${itemCols.restaurantId}
    AND ${categories}.${categoryCols.restaurantId} = ?
    AND ${categories}.${categoryCols.id} = ?
    AND ${menuItems}.${itemCols.id} = ?
    `;
    const params: MixedArray = [
      row.categoryId,
      row.menuItemId,
      row.restaurantId,
      row.restaurantId,
      row.categoryId,
      row.menuItemId,
    ];
    return { params, query };
  }

  updateMenuItemCategoryRef(
    row: MenuItemCategoryUpdateQuery
  ): TransactionQuery {
    const query = `
    UPDATE ${tableName}
    SET ${categoryId} = ?
    WHERE ${categoryId} = ?
    AND ${menuItemId} = ?
    AND ${restaurantId} = ?`;
    const params: MixedArray = [
      row.categoryId,
      row.oldCategoryId,
      row.menuItemId,
      row.restaurantId,
    ];
    return { params, query };
  }
}

export const menuItemCategoryQueries = new MenuItemCategoryQueries();
