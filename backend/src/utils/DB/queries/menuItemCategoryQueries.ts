import { MenuItemCategoryTable } from "../../../models/MenuItem";
import { MixedArray, TransactionQuery } from "../dbConfig";
import { DB } from "../tables";

const {
  columns: { categoryId, menuItemId },
  tableName,
} = DB.tables.menu_items_category;

type MenuItemCategoryInsertQuery = MenuItemCategoryTable & {
  restaurantId: number;
};
type MenuItemCategoryUpdateQuery = MenuItemCategoryInsertQuery & {
  oldCategoryId: number;
};
class MenuItemCategoryQueries {
  createMenuItemCategoryRef(
    row: MenuItemCategoryInsertQuery
  ): TransactionQuery {
    const { columns: categoryCols, tableName: categories } =
      DB.tables.categories;
    const { columns: itemCols, tableName: menuItems } = DB.tables.menu_items;
    const query = `INSERT INTO ${tableName} 
    (${categoryId}, ${menuItemId})
    SELECT ?, ?
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
      row.categoryId,
      row.menuItemId,
    ];
    return { params, query };
  }

  updateMenuItemCategoryRef(
    row: MenuItemCategoryUpdateQuery
  ): TransactionQuery {
    const { columns: categoryCols, tableName: categories } =
      DB.tables.categories;
    const { columns: itemCols, tableName: menuItems } = DB.tables.menu_items;
    const query = `
    UPDATE ${tableName}
    JOIN ${categories} 
    ON ${categories}.${categoryCols.id} = ${tableName}.${categoryId}
    JOIN ${menuItems}
    ON ${menuItems}.${itemCols.id} = ${tableName}.${menuItemId}
    SET ${tableName}.${categoryId} = ?
    WHERE ${categories}.${categoryCols.restaurantId} = ?
    AND ${menuItems}.${itemCols.restaurantId} = ?
    AND ${tableName}.${categoryId} = ?
    AND ${tableName}.${menuItemId} = ?`;
    const params: MixedArray = [
      row.categoryId,
      row.restaurantId,
      row.restaurantId,
      row.oldCategoryId,
      row.menuItemId,
    ];
    return { params, query };
  }
}

export const menuItemCategoryQueries = new MenuItemCategoryQueries();
