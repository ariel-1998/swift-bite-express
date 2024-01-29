import { User } from "../../../models/User";
import { TransactionQuery } from "../dbConfig";
import { DB } from "../tables";

class UserQueries {
  updateUserAddressIdQuery(
    user: User,
    addressId: number | null
  ): TransactionQuery {
    const { columns, tableName } = DB.tables.users;
    const query = `UPDATE ${tableName}
        SET ${columns.primaryAddressId} = ?
        WHERE ${columns.id} = ?`;
    const params = [addressId, user.id];
    return { params, query };
  }
}

export const userQueries = new UserQueries();
