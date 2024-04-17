import { z } from "zod";
import { menuItemOptionsSchema } from "../../../models/MenuItemOption";
import { DB } from "../tables";
import { MixedArray, TransactionQuery } from "../dbConfig";

type Options = z.infer<typeof menuItemOptionsSchema>;

const {
  columns: { id, menuItemId, name },
  tableName,
} = DB.tables.menu_item_options;

class MenuItemOptionsQueries {
  createOptions(options: Options, restaurantId: number): TransactionQuery {
    const { columns: itemsCols, tableName: menuItems } = DB.tables.menu_items;
    let placeHolders = "";
    const values: (number | string)[] = [];
    options.options.forEach((opt, i) => {
      placeHolders += "SELECT ?, ? ";
      if (i !== options.options.length - 1) placeHolders += "UNION ALL ";
      values.push(options.menuItemId, opt);
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
    const params: MixedArray = [...values, options.menuItemId, restaurantId];
    return { query, params };
  }

  deleteOption(optionId: number, restaurantId: number): TransactionQuery {
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
    const params: MixedArray = [optionId, restaurantId];
    return { params, query };
  }

  getOptionsByMenuItemId(menuItemId: number): TransactionQuery {
    const query = `
    SELECT * FROM ${tableName}
    WHERE ${menuItemId} = ?
    `;
    const params: MixedArray = [menuItemId];
    return { params, query };
  }
}

export const menuItemOptionsQueries = new MenuItemOptionsQueries();
