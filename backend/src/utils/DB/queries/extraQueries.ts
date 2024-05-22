import { SideDish } from "../../../models/SideDish";
import { TurnUndefinedToNullInObj } from "../../helperFunctions";
import { MixedArray, TransactionQuery } from "../dbConfig";
import { DB } from "../tables";

type SideDishQuery = TurnUndefinedToNullInObj<SideDish>;
//done
const {
  columns: { id, menuItemId, name, type, extraPrice, restaurantId },
  tableName,
} = DB.tables.side_dishes;

class SideDishQueries {
  getAllSideDishessByMenuItemId(itemId: number): TransactionQuery {
    const query = `SELECT * FROM ${tableName} WHERE ${menuItemId} = ?`;
    const params: MixedArray = [itemId];
    return { params, query };
  }

  createSideDish(sideDish: Omit<SideDishQuery, "id">): TransactionQuery {
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
      sideDish.menuItemId,
      sideDish.name,
      sideDish.type,
      sideDish.extraPrice,
      sideDish.restaurantId,
      sideDish.menuItemId,
      sideDish.restaurantId,
    ];
    return { params, query };
  }

  updateSideDish(sideDish: SideDishQuery): TransactionQuery {
    const query = `
    UPDATE ${tableName} 
    SET ${name} = ?,
        ${type} = ?,
        ${extraPrice} = ?
    WHERE ${id} = ?
    AND ${menuItemId} = ?
    AND ${restaurantId} = ?`;
    const params: MixedArray = [
      sideDish.name,
      sideDish.type,
      sideDish.extraPrice,
      sideDish.id,
      sideDish.menuItemId,
      sideDish.restaurantId,
    ];
    return { params, query };
  }

  deleteSideDish(
    ids: Pick<SideDish, "id" | "menuItemId" | "restaurantId">
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

export const sideDishQueries = new SideDishQueries();
