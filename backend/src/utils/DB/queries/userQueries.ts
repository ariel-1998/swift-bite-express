import { Role, User } from "../../../models/User";
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

  updateUserRole(role: Role): TransactionQuery {
    const query = `
    UPDATE ${tableName} 
    SET ${columns.role} = ? 
    `;
    const params: MixedArray = [role];
    return { params, query };
  }
}

export const userQueries = new UserQueries();
