import { z } from "zod";
import { menuItemPreparationStyleSchema } from "../../../models/MenuItemPreparationStyle";
import { DB } from "../tables";
import { MixedArray, TransactionQuery } from "../dbConfig";

type Styles = z.infer<typeof menuItemPreparationStyleSchema>;

const {
  columns: { id, menuItemId, name },
  tableName,
} = DB.tables.menu_item_preparation_style;

class MenuItemPreparationStylesQueries {
  createStyles(obj: Styles, restaurantId: number): TransactionQuery {
    const { columns: itemsCols, tableName: menuItems } = DB.tables.menu_items;
    let placeHolders = "";
    const values: (number | string)[] = [];
    obj.preparationStyles.forEach((sty, i) => {
      placeHolders += "SELECT ?, ? ";
      if (i !== obj.preparationStyles.length - 1) placeHolders += "UNION ALL ";
      values.push(obj.menuItemId, sty);
    });
    const query = `
    INSERT INTO ${tableName} (${menuItemId}, ${name})
    ${placeHolders}
    WHERE EXISTS (
      SELECT ${itemsCols.id}
      FROM ${menuItems}
      WHERE ${itemsCols.id} = ?
      AND ${itemsCols.restaurantId} = ?
    )
    `;
    const params: MixedArray = [...values, obj.menuItemId, restaurantId];
    return { query, params };
  }

  deleteStyle(styleId: number, restaurantId: number): TransactionQuery {
    const { columns: itemsCols, tableName: menuItems } = DB.tables.menu_items;
    const query = `
    DELETE FROM ${tableName}
    WHERE ${id} = ?
    AND EXISTS (
      SELECT 1 FROM ${menuItems}
      WHERE ${tableName}.${menuItemId} = ${menuItems}.${itemsCols.id}
      AND ${menuItems}.${itemsCols.restaurantId} = ?
    )
    `;
    const params: MixedArray = [styleId, restaurantId];
    return { params, query };
  }

  getStylesByMenuItemId(itemId: number): TransactionQuery {
    const query = `
    SELECT * FROM ${tableName}
    WHERE ${menuItemId} = ?
    `;
    const params: MixedArray = [itemId];
    return { params, query };
  }
}

export const menuItemPreparationStylesQueries =
  new MenuItemPreparationStylesQueries();
