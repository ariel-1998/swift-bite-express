import { Sauce } from "../../../models/Sauce";
import { MixedArray, TransactionQuery } from "../dbConfig";
import { DB } from "../tables";

const {
  columns: { id, name, restaurantId },
  tableName,
} = DB.tables.sauces;

class SauceQueries {
  getAllSacesByRestaurantId(restaurantId: number): TransactionQuery {
    const query = `SELECT * FROM ${tableName} WHERE ${restaurantId} = ?`;
    const params: MixedArray = [restaurantId];
    return { params, query };
  }

  createSauce(sauce: Omit<Sauce, "id">): TransactionQuery {
    const query = `
    INSERT INTO ${tableName} 
    (${restaurantId}, ${name})
    VALUES(?, ?)`;
    const params: MixedArray = [sauce.restaurantId, sauce.name];
    return { params, query };
  }

  updateSauce(sauce: Sauce): TransactionQuery {
    const query = `UPDATE ${tableName} SET ${name} = ? WHERE ${id} = ? AND ${restaurantId} = ?`;
    const params: MixedArray = [sauce.name, sauce.id, sauce.restaurantId];
    return { params, query };
  }

  deleteSauce(sauce: Omit<Sauce, "name">): TransactionQuery {
    const query = `DELETE FROM ${tableName} WHERE ${id} = ? AND ${restaurantId} = ?`;
    const params: MixedArray = [sauce.id, sauce.restaurantId];
    return { params, query };
  }
}

export const sauceQueries = new SauceQueries();
