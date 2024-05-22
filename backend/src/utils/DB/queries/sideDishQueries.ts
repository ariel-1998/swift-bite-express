import { SideDish } from "../../../models/SideDish";
import { TurnUndefinedToNullInObj } from "../../helperFunctions";
import { MixedArray, TransactionQuery } from "../dbConfig";
import { DB } from "../tables";

type SideDishQuery = TurnUndefinedToNullInObj<SideDish>;
//done
const {
  columns: { id, name, type, extraPrice, restaurantId },
  tableName,
} = DB.tables.side_dishes;

class SideDishQueries {
  getAllSideDishessByMenuItemId(restId: number): TransactionQuery {
    const query = `SELECT * FROM ${tableName} WHERE ${restaurantId} = ?`;
    const params: MixedArray = [restId];
    return { params, query };
  }

  createSideDish(sideDish: Omit<SideDishQuery, "id">): TransactionQuery {
    //check queries in this page
    const query = `
    INSERT INTO ${tableName}
    (${name}, ${type}, ${extraPrice}, ${restaurantId})
    VALUES (?,?,?,?)`;
    const params: MixedArray = [
      sideDish.name,
      sideDish.type,
      sideDish.extraPrice,
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
    AND ${restaurantId} = ?`;
    const params: MixedArray = [
      sideDish.name,
      sideDish.type,
      sideDish.extraPrice,
      sideDish.id,
      sideDish.restaurantId,
    ];
    return { params, query };
  }

  deleteSideDish(ids: Pick<SideDish, "id" | "restaurantId">): TransactionQuery {
    const query = `
    DELETE FROM ${tableName}
    WHERE ${id} = ?
    AND ${restaurantId} = ?
    `;
    const params: MixedArray = [ids.id, ids.restaurantId];
    return { params, query };
  }
}

export const sideDishQueries = new SideDishQueries();
