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

    // const query = `INSERT INTO ${tableName}
    // (${categoryId}, ${menuItemId}, ${restaurantId})
    // SELECT ?, ?, ?
    // FROM ${categories}
    // JOIN ${menuItems}
    // ON ${categories}.${categoryCols.restaurantId} = ${menuItems}.${itemCols.restaurantId}
    // AND ${categories}.${categoryCols.restaurantId} = ?
    // AND ${categories}.${categoryCols.id} = ?
    // AND ${menuItems}.${itemCols.id} = ?`;

    const insertQuery = `
  INSERT INTO ${tableName} (${categoryId}, ${menuItemId}, ${restaurantId})
  SELECT ?, mi.id, ?
  FROM (VALUES ${obj.menuItems.map(() => "(?)").join(", ")}) AS mi(id)
  WHERE EXISTS (
    SELECT 1
    FROM (
      SELECT *
      FROM ${menuItems}
      WHERE id = mi.id
      AND restaurantId = ?
    ) AS mi_check
    JOIN categories AS c ON c.id = mi_check.id
    WHERE c.restaurantId = ?
  )`;

    // const query = `
    // INSERT INTO ${tableName} (${categoryId}, ${menuItemId}, ${restaurantId})
    // SELECT ?, mi.id, ?
    // FROM (VALUES (${placeHolders.join(", ")})) AS mi(id)
    // WHERE EXISTS (
    //     SELECT 1
    //     FROM ${menuItems} AS m
    //     WHERE m.id = mi.id
    //     AND m.${itemCols.restaurantId} = ?
    // )
    // AND ? = ${categories}.${categoryCols.restaurantId}`;

    // const params: MixedArray = [
    //   obj.categoryId,
    //   obj.restaurantId,
    //   ...obj.menuIems,
    //   obj.restaurantId,
    //   obj.restaurantId,
    // ];
    const params: MixedArray = [
      obj.categoryId, // Constant category ID (repeated for each row)
      obj.restaurantId, // Constant restaurant ID (repeated for each row)
      ...obj.menuItems, // Flatten menu items into individual parameters
      ...obj.menuItems, // Repeat menu items for subquery check
      obj.restaurantId, // Restaurant ID for subquery check
    ];
    console.log("query", insertQuery);
    console.log("params", params);

    return { params, query: insertQuery };
  }
  // createMenuItemCategoryRef(row: MenuItemCategoryTable): TransactionQuery {
  //   const { columns: categoryCols, tableName: categories } =
  //     DB.tables.categories;
  //   const { columns: itemCols, tableName: menuItems } = DB.tables.menu_items;
  //   const query = `INSERT INTO ${tableName}
  //   (${categoryId}, ${menuItemId}, ${restaurantId})
  //   SELECT ?, ?, ?
  //   FROM ${categories}
  //   JOIN ${menuItems}
  //   ON ${categories}.${categoryCols.restaurantId} = ${menuItems}.${itemCols.restaurantId}
  //   AND ${categories}.${categoryCols.restaurantId} = ?
  //   AND ${categories}.${categoryCols.id} = ?
  //   AND ${menuItems}.${itemCols.id} = ?
  //   `;

  //   const params: MixedArray = [
  //     row.categoryId,
  //     row.menuItemId,
  //     row.restaurantId,
  //     row.restaurantId,
  //     row.categoryId,
  //     row.menuItemId,
  //   ];
  //   return { params, query };
  // }

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
