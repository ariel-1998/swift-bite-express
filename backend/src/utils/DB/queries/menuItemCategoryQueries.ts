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
  createMenuItemCategoryRef(obj: {
    menuItems: number[];
    categoryId: number;
    restaurantId: number;
  }): TransactionQuery {
    const { columns: categoryCols, tableName: categories } =
      DB.tables.categories;
    const { columns: itemCols, tableName: menuItems } = DB.tables.menu_items;

    const menuItemIdPlacholders = obj.menuItems.map(() => "?").join(", ");
    const query = `
  INSERT INTO ${tableName} (${categoryId}, ${menuItemId}, ${restaurantId})
  SELECT 
${categories}.${categoryCols.id}, 
  ${menuItems}.${itemCols.id}, 
  ${categories}.${categoryCols.restaurantId}
  FROM ${categories}
  JOIN ${menuItems}
  ON ${categories}.${categoryCols.restaurantId} = ${menuItems}.${itemCols.restaurantId}
  AND ${categories}.${categoryCols.restaurantId} = ?
  AND ${categories}.${categoryCols.id} = ?
  AND ${menuItems}.${itemCols.id} IN (${menuItemIdPlacholders})
  `;

    const params: MixedArray = [
      obj.restaurantId,
      obj.categoryId,
      ...obj.menuItems,
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
