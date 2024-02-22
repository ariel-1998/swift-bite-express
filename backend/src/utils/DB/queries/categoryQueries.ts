import { Category } from "../../../models/Category";
import { TurnUndefinedToNullInObj } from "../../helperFunctions";
import { MixedArray, TransactionQuery } from "../dbConfig";
import { DB } from "../tables";

const {
  columns: { id, restaurantId, name, description },
  tableName,
} = DB.tables.categories;

type CategoryQuery = TurnUndefinedToNullInObj<Category>;

class CategoryQueries {
  getAllCategoriesByRestaurantId(restId: number): TransactionQuery {
    const query = `SELECT * FROM ${tableName} WHERE ${restaurantId} = ?`;
    const params: MixedArray = [restId];
    return { params, query };
  }

  addCategory(category: Omit<CategoryQuery, "id">): TransactionQuery {
    const query = `
    INSERT INTO ${tableName} 
    (${restaurantId}, ${name}, ${description})
    VALUES(?, ?, ?)
    `;
    const params: MixedArray = [
      category.restaurantId,
      category.name,
      category.description,
    ];
    return { params, query };
  }

  updateCategory(category: CategoryQuery): TransactionQuery {
    const query = `
    UPDATE ${tableName} 
    SET ${name} = ?,
    ${description} = ?
    WHERE ${id} = ? AND ${restaurantId} = ?
    `;
    const params: MixedArray = [
      category.name,
      category.description,
      category.id,
      category.restaurantId,
    ];
    return { params, query };
  }

  deleteCategory(
    ids: Pick<CategoryQuery, "id" | "restaurantId">
  ): TransactionQuery {
    const query = `DELETE FROM ${tableName} WHERE ${id} = ? AND ${restaurantId} = ?`;
    const params: MixedArray = [ids.id, ids.restaurantId];
    return { params, query };
  }
}

export const categoryQueries = new CategoryQueries();
