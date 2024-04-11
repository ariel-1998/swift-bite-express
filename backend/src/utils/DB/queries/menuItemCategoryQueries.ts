import { MixedArray, TransactionQuery } from "../dbConfig";
import { DB } from "../tables";

const {
  columns: { categoryId, menuItemId, restaurantId },
  tableName,
} = DB.tables.menu_items_category;

type ItemCategoryRef = {
  menuItemId: number;
  categoryIds: number[];
  restaurantId: number;
};

type TransactionQueries = {
  deleteQuery: TransactionQuery;
  insertQuery: TransactionQuery;
};

class MenuItemCategoryQueries {
  private createCategoryIdPlaceholders(categoryIds: number[]) {
    return categoryIds.map(() => "?").join(", ");
  }
  createMenuItemCategoryRef(obj: ItemCategoryRef): TransactionQuery {
    const { columns: categoryCols, tableName: categories } =
      DB.tables.categories;
    const { columns: itemCols, tableName: menuItems } = DB.tables.menu_items;

    // const menuItemIdPlacholders = obj.categoryIds.map(() => "?").join(", ");
    const menuItemIdPlacholders = this.createCategoryIdPlaceholders(
      obj.categoryIds
    );
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
    AND ${menuItems}.${itemCols.id} = ?
    AND ${categories}.${categoryCols.id} IN (${menuItemIdPlacholders})
    `;

    const params: MixedArray = [
      obj.restaurantId,
      obj.menuItemId,
      ...obj.categoryIds,
    ];

    return { params, query };
  }

  updateMenuItemCategoryRef(obj: ItemCategoryRef): TransactionQueries {
    const { columns: categoryCols, tableName: categories } =
      DB.tables.categories;
    const { columns: itemCols, tableName: menuItems } = DB.tables.menu_items;

    const deleteQuery = `
    DELETE FROM ${tableName} 
    WHERE ${menuItemId} = ?
    AND  ${restaurantId} = ?
    `;

    const deleteParams: MixedArray = [obj.menuItemId, obj.restaurantId];

    const menuItemIdPlacholders = this.createCategoryIdPlaceholders(
      obj.categoryIds
    );
    const insertQuery = `
    INSERT INTO ${tableName} (${categoryId}, ${menuItemId}, ${restaurantId})
    SELECT 
    ${categories}.${categoryCols.id}, 
    ${menuItems}.${itemCols.id}, 
    ${categories}.${categoryCols.restaurantId}
    FROM ${categories}
    JOIN ${menuItems}
    ON ${categories}.${categoryCols.restaurantId} = ${menuItems}.${itemCols.restaurantId}
    AND ${categories}.${categoryCols.restaurantId} = ?
    AND ${menuItems}.${itemCols.id} = ?
    AND ${categories}.${categoryCols.id} IN (${menuItemIdPlacholders})
    `;

    const insertParams: MixedArray = [
      obj.restaurantId,
      obj.menuItemId,
      ...obj.categoryIds,
    ];
    const deleteQ: TransactionQuery = {
      query: deleteQuery,
      params: deleteParams,
    };
    const insertQ: TransactionQuery = {
      query: insertQuery,
      params: insertParams,
    };
    return { deleteQuery: deleteQ, insertQuery: insertQ };
  }
}

export const menuItemCategoryQueries = new MenuItemCategoryQueries();
