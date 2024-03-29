import { RestauransOwnerAddressTable } from "../../../models/RestauransOwnerAddressTable";
import { MixedArray, TransactionQuery } from "../dbConfig";
import { DB } from "../tables";

//might need to change as i made the table with of cascade and set null on delete
const { columns, tableName } = DB.tables.restaurant_owner_address;
class RestauransOwnerAddressQueries {
  getRowByUserIdAndRestaurantId(
    restaurantId: number,
    userId: number
  ): TransactionQuery {
    const query = `SELECT * FROM ${tableName} WHERE ${columns.restaurantId} = ? AND ${columns.userId} = ?`;
    const params: MixedArray = [restaurantId, userId];
    return { params, query };
  }

  updateAddressInRow(obj: RestauransOwnerAddressTable): TransactionQuery {
    const { addressId, restaurantId, userId } = obj;
    const query = `
    UPDATE ${tableName} 
    SET ${columns.addressId} = ?
    WHERE ${columns.restaurantId} = ? 
    AND ${columns.userId} = ?`;
    const params: MixedArray = [addressId, restaurantId, userId];
    return { params, query };
  }

  addRow(obj: RestauransOwnerAddressTable): TransactionQuery {
    const { addressId, restaurantId, userId } = obj;
    const query = `
    INSERT INTO ${tableName} 
    (${columns.addressId}, ${columns.restaurantId}, ${columns.userId})
    VALUES(?,?,?)
    `;
    const params: MixedArray = [addressId, restaurantId, userId];
    return { params, query };
  }

  deleteRow(restaurantId: number, userId: number): TransactionQuery {
    const query = `DELETE FROM ${tableName} WHERE ${columns.restaurantId} = ? AND ${columns.userId} = ?`;
    const params: MixedArray = [restaurantId, userId];
    return { params, query };
  }

  //created for user role update to check if there are any restaurants that owned by the user
  //before updating from role "owner" to role "user"
  getRowsByUserId(userId: number): TransactionQuery {
    const query = `SELECT * FROM ${tableName} WHERE ${columns.userId} = ?`;
    const params: MixedArray = [userId];
    return { params, query };
  }
}

export const restauransOwnerAddressQueries =
  new RestauransOwnerAddressQueries();
