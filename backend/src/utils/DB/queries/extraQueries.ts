import { Extra } from "../../../models/MenuItem";
import { TurnUndefinedToNullInObj } from "../../helperFunctions";
import { MixedArray, TransactionQuery } from "../dbConfig";
import { DB } from "../tables";

type ExtraQuery = TurnUndefinedToNullInObj<Extra>;
//done
const {
  columns: { id, menuItemId, name, type, extraPrice },
  tableName,
} = DB.tables.extras;

class ExtraQueries {
  getAllExtrasByMenuItemId(itemId: number): TransactionQuery {
    const query = `SELECT * FROM ${tableName} WHERE ${menuItemId} = ?`;
    const params: MixedArray = [itemId];
    return { params, query };
  }

  createExtra(extra: ExtraQuery, restId: number): TransactionQuery {
    const { columns: itemCols, tableName: menuItems } = DB.tables.menu_items;
    const query = `
    INSERT INTO ${tableName}
    (${menuItemId}, ${name}, ${type}, ${extraPrice})
    SELECT ?, ?, ?, ?
    FROM ${menuItems} 
    WHERE ${menuItems}.${itemCols.id} = ?
    AND ${menuItems}.${itemCols.restaurantId} = ? 
    `;
    const params: MixedArray = [
      extra.menuItemId,
      extra.name,
      extra.type,
      extra.extraPrice,
      extra.menuItemId,
      restId,
    ];
    return { params, query };
  }

  updateExtra(
    extra: Omit<ExtraQuery, "menuItemId">,
    restId: number
  ): TransactionQuery {
    const { columns: itemCols, tableName: menuItems } = DB.tables.menu_items;
    const query = `
        UPDATE ${tableName}
        JOIN ${menuItems} 
        ON ${tableName}.${menuItemId} = ${menuItems}.${itemCols.id} 
        SET ${name} = ?,
        ${type} = ?,
        ${extraPrice} = ?
        WHERE ${tableName}.${id} = ?
        AND ${menuItems}.${itemCols.restaurantId} = ?`;
    const params: MixedArray = [
      extra.name,
      extra.type,
      extra.extraPrice,
      extra.id,
      restId,
    ];
    return { params, query };
  }

  deleteExtra(extraId: number, restaurantId: number): TransactionQuery {
    const { columns: itemCols, tableName: menuItems } = DB.tables.menu_items;
    const query = `
    DELETE FROM ${tableName}
    JOIN ${menuItems}
    ON ${tableName}.${menuItemId} = ${menuItems}.${itemCols.id}
    WHERE ${tableName}.${id} = ?
    AND ${menuItems}.${itemCols.restaurantId} = ? 
    `;
    const params: MixedArray = [extraId, restaurantId];
    return { params, query };
  }
}

export const extraQueries = new ExtraQueries();
