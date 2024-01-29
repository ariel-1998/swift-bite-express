import { IsOwner, User } from "../../../models/User";
import { MixedArray, TransactionQuery } from "../dbConfig";
import { DB } from "../tables";

const { columns, tableName } = DB.tables.users;

class UserQueries {
  updateUserAddressIdQuery(
    user: User,
    addressId: number | null
  ): TransactionQuery {
    const query = `UPDATE ${tableName}
        SET ${columns.primaryAddressId} = ?
        WHERE ${columns.id} = ?`;
    const params: MixedArray = [addressId, user.id];
    return { params, query };
  }

  updateUserIsRestaurantOwner(isOwner: IsOwner): TransactionQuery {
    const query = `
    UPDATE ${tableName} 
    SET ${columns.isRestaurantOwner} = ? 
    `;
    const params: MixedArray = [isOwner];
    return { params, query };
  }
}

export const userQueries = new UserQueries();
