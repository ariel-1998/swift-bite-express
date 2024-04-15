import { z } from "zod";
import {
  MenuItemOption,
  menuItemOptionsSchema,
} from "../../../models/MenuItemOption";
import { DB } from "../tables";
import { MixedArray, TransactionQuery } from "../dbConfig";

type Options = z.infer<typeof menuItemOptionsSchema>;
type TransactionQueries = {
  deleteQuery: TransactionQuery;
  insertQuery: TransactionQuery;
};
const {
  columns: { id, menuItemId, name },
  tableName,
} = DB.tables.menu_item_options;

class MenuItemOptionsQueries {
  private createOptionsPlaceholdersAndVals({ menuItemId, options }: Options) {
    let placeHolders = "";
    const vals: (string | number)[] = [];
    options.forEach((opt, i) => {
      placeHolders += i === options.length - 1 ? "(?, ?)" : "(?, ?), ";
      vals.push(menuItemId);
      vals.push(opt);
    });
    return { placeHolders, vals };
  }

  createOptions(options: Options): TransactionQuery {
    const { placeHolders, vals } =
      this.createOptionsPlaceholdersAndVals(options);
    //need to check how to insert only if menuItem has restaurantId = menuItemId
    const query = `
    INSERT INTO ${tableName} (${menuItemId}, ${name})
    VALUES ${placeHolders}
    `;
    const params: MixedArray = vals;
    return { query, params };
  }
  //need to check how to delete based on restaurantId in menuitems table
  //   private deleteOptions(
  //     options: Options,
  //     restaurantId: number
  //   ): TransactionQuery {
  //     const { columns: itemsCols, tableName: menuItems } = DB.tables.menu_items;
  //     const query = `
  //     DELETE FROM ${tableName}
  //     JOIN ${menuItems}
  //     ON ${tableName}.${menuItemId} = ${menuItems}.${itemsCols.id}
  //     WHERE ${tableName}.${id} = ?
  //     AND ${menuItems}.${itemsCols.restaurantId} = ?
  //     `;
  //     const params: MixedArray = [options.menuItemId, restaurantId];
  //     return { params, query };
  //   }
  //   updateOptions(options: Options, restaurantId: number): TransactionQueries {
  //     const deleteQuery = this.deleteOptions(options, restaurantId);
  //     const insertQuery = this.createOptions(options);
  //     return { deleteQuery, insertQuery };
  //   }
}

export const menuItemOptionsQueries = new MenuItemOptionsQueries();
