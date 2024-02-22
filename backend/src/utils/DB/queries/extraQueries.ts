import { Extra } from "../../../models/Extra";
import { TurnUndefinedToNullInObj } from "../../helperFunctions";
import { MixedArray, TransactionQuery } from "../dbConfig";
import { DB } from "../tables";

type ExtraQuery = TurnUndefinedToNullInObj<Extra>;
//done
const {
  columns: { id, menuItemId, name, type, extraPrice, restaurantId },
  tableName,
} = DB.tables.extras;

class ExtraQueries {
  getAllExtrasByMenuItemId(itemId: number): TransactionQuery {
    const query = `SELECT * FROM ${tableName} WHERE ${menuItemId} = ?`;
    const params: MixedArray = [itemId];
    return { params, query };
  }

  createExtra(extra: Omit<ExtraQuery, "id">): TransactionQuery {
    const { columns: itemCols, tableName: menuItems } = DB.tables.menu_items;
    const query = `
    INSERT INTO ${tableName}
    (${menuItemId}, ${name}, ${type}, ${extraPrice}, ${restaurantId})
    SELECT ?, ?, ?, ?, ?
    FROM ${menuItems} 
    WHERE ${menuItems}.${itemCols.id} = ?
    AND ${menuItems}.${itemCols.restaurantId} = ? 
    `;
    const params: MixedArray = [
      extra.menuItemId,
      extra.name,
      extra.type,
      extra.extraPrice,
      extra.restaurantId,
      extra.menuItemId,
      extra.restaurantId,
    ];
    return { params, query };
  }

  updateExtra(extra: ExtraQuery): TransactionQuery {
    const query = `
    UPDATE ${tableName} 
    SET ${name} = ?,
        ${type} = ?,
        ${extraPrice} = ?
    WHERE ${id} = ?
    AND ${menuItemId} = ?
    AND ${restaurantId} = ?`;
    const params: MixedArray = [
      extra.name,
      extra.type,
      extra.extraPrice,
      extra.id,
      extra.menuItemId,
      extra.restaurantId,
    ];
    return { params, query };
  }

  deleteExtra(
    ids: Pick<Extra, "id" | "menuItemId" | "restaurantId">
  ): TransactionQuery {
    const query = `
    DELETE FROM ${tableName}
    WHERE ${id} = ?
    AND ${menuItemId} = ?
    AND ${restaurantId} = ?
    `;
    const params: MixedArray = [ids.id, ids.menuItemId, ids.restaurantId];
    return { params, query };
  }
}

export const extraQueries = new ExtraQueries();
