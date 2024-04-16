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
    drinksAmount,
    showSouces,
    restaurantId,
    price,
  },
} = DB.tables.menu_items;

class MenuItemsQueries {
  createMenuItem(menuItem: Omit<MenuItemQuery, "id">): TransactionQuery {
    const query = `
      INSERT INTO ${tableName} 
      (${restaurantId}, ${name}, ${description}, ${imgPublicId}, ${extrasAmount}, ${drinksAmount}, ${showSouces}, ${price})
      VALUES(?,?,?,?,?,?,?,?)`;

    const params: MixedArray = [
      menuItem.restaurantId,
      menuItem.name,
      menuItem.description,
      menuItem.imgPublicId,
      menuItem.extrasAmount,
      menuItem.drinksAmount,
      menuItem.showSouces,
      menuItem.price,
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
    ${drinksAmount} = ?,
    ${showSouces} = ?,
    ${price} = ?
    WHERE ${id} = ? And ${restaurantId} = ?
    `;
    const params: MixedArray = [
      menuItem.name,
      menuItem.description,
      menuItem.extrasAmount,
      menuItem.drinksAmount,
      menuItem.showSouces,
      menuItem.price,
      menuItem.id,
      menuItem.restaurantId,
    ];
    return { params, query };
  }
  getMenuItemById(menuItemId: number): TransactionQuery {
    const { columns: optionCols, tableName: options } =
      DB.tables.menu_item_options;
    const query = `
    SELECT 
      ${tableName}.*,
    CASE 
    WHEN  
      COUNT(menu_item_options.id) > 0 
    THEN
      JSON_ARRAYAGG(
        JSON_OBJECT(
          '${optionCols.id}', ${options}.${optionCols.id},
          '${optionCols.menuItemId}', ${options}.${optionCols.menuItemId},
          '${optionCols.name}', ${options}.${optionCols.name}
        )  
      ) 
    ELSE 
      JSON_ARRAY()
    END 
      AS options
    FROM 
      ${tableName} 
    LEFT JOIN 
      ${options} 
    ON 
      ${tableName}.${id} = ${options}.${optionCols.menuItemId}
    WHERE 
      ${tableName}.${id} = ? 
    GROUP BY ${tableName}.${id}
    `;
    const params: MixedArray = [menuItemId];
    return { params, query };
  }
  getMenuItemsByRestaurantId(
    restId: number,
    isOwner: boolean
  ): TransactionQuery {
    const { columns: categoryCols, tableName: categories } =
      DB.tables.categories;
    const { columns: micCols, tableName: mic } = DB.tables.menu_items_category;
    const { columns: optionCols, tableName: options } =
      DB.tables.menu_item_options;

    const orderBy = isOwner
      ? `${tableName}.${id}`
      : `${categories}.${categoryCols.id}`;
    const query = `
    SELECT 
      ${tableName}.*, 
      CASE
      WHEN 
        COUNT(menu_item_options.id) > 0 
      THEN
        JSON_ARRAYAGG(
          JSON_OBJECT(
            '${optionCols.id}', ${options}.${optionCols.id},
            '${optionCols.menuItemId}', ${options}.${optionCols.menuItemId},
            '${optionCols.name}', ${options}.${optionCols.name}
          )  
        ) 
      ELSE
        JSON_ARRAY()
      END
        AS options,
      CASE
      WHEN 
        ${categories}.${categoryCols.id} IS NOT NULL
      THEN
        JSON_OBJECT(
            '${categoryCols.id}', ${categories}.${categoryCols.id},
            '${categoryCols.name}', ${categories}.${categoryCols.name},
            '${categoryCols.description}', ${categories}.${categoryCols.description},
            '${categoryCols.restaurantId}', ${categories}.${categoryCols.restaurantId}
        ) 
      ELSE 
        NULL  
      END 
        AS category
    FROM 
      ${tableName}
    LEFT JOIN 
      ${options} ON ${tableName}.${id} = ${options}.${optionCols.menuItemId}
    LEFT JOIN 
      ${mic} ON ${mic}.${micCols.menuItemId} = ${tableName}.${id}
    LEFT JOIN 
      ${categories} ON ${categories}.${categoryCols.id} = ${mic}.${micCols.categoryId}
    WHERE 
      ${tableName}.${restaurantId} = ?
    GROUP BY 
      ${tableName}.${id},${categories}.${categoryCols.id}
    ORDER BY 
      ${orderBy}
    `;
    const params: MixedArray = [restId];
    return { params, query };
  }

  deleteMenuItem(menuItemId: number, restId: number): TransactionQuery {
    const query = `DELETE FROM ${tableName} WHERE ${id} = ? AND ${restaurantId} = ?`;
    const params: MixedArray = [menuItemId, restId];
    return { params, query };
  }
}

export const menuItemsQueries = new MenuItemsQueries();
