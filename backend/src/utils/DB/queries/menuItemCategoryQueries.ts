import { MenuItemCategoryTable } from "../../../models/MenuItem";
import { MixedArray, TransactionQuery } from "../dbConfig";
import { DB } from "../tables";

const {
  columns: { categotyId, menuItemId },
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
    (${categotyId}, ${menuItemId})
    SELECT ?, ?
    FROM ${categories}
    JOIN ${menuItems} 
    ON ${categories}.${categoryCols.restaurantId} = ${menuItems}.${itemCols.restaurantId}
    AND ${categories}.${categoryCols.restaurantId} = ?
    AND ${categories}.${categoryCols.id} = ?
    AND ${menuItems}.${itemCols.id} = ?
    `;
    const params: MixedArray = [
      row.categotyId,
      row.menuItemId,
      row.restaurantId,
      row.categotyId,
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
    ON ${categories}.${categoryCols.id} = ${tableName}.${categotyId}
    JOIN ${menuItems}
    ON ${menuItems}.${itemCols.id} = ${tableName}.${menuItemId}
    SET ${tableName}.${categotyId} = ?
    WHERE ${categories}.${categoryCols.restaurantId} = ?
    AND ${menuItems}.${itemCols.restaurantId} = ?
    AND ${tableName}.${categotyId} = ?
    AND ${tableName}.${menuItemId} = ?`;
    const params: MixedArray = [
      row.categotyId,
      row.restaurantId,
      row.restaurantId,
      row.oldCategoryId,
      row.menuItemId,
    ];
    return { params, query };
  }
}

export const menuItemCategoryQueries = new MenuItemCategoryQueries();
