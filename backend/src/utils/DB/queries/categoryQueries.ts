import { CategorySchema } from "../../../models/Category";
import { MixedArray, TransactionQuery } from "../dbConfig";
import { DB } from "../tables";

const {
  columns: { id, restaurantId, name, description },
  tableName,
} = DB.tables.categories;

class CategoryQueries {
  getAllCategoriesByRestaurantId(restId: number): TransactionQuery {
    const query = `SELECT * FROM ${tableName} WHERE ${restaurantId} = ?`;
    const params: MixedArray = [restId];
    return { params, query };
  }

  getSingleCategoryById(categoryId: number): TransactionQuery {
    const query = `SELECT * FROM ${tableName} WHERE ${id} = ?`;
    const params: MixedArray = [categoryId];
    return { params, query };
  }

  addCategory(category: Omit<CategorySchema, "id">): TransactionQuery {
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

  updateCategory(category: CategorySchema): TransactionQuery {
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
    ids: Pick<CategorySchema, "id" | "restaurantId">
  ): TransactionQuery {
    const query = `DELETE FROM ${tableName} WHERE ${id} = ? AND ${restaurantId} = ?`;
    const params: MixedArray = [ids.id, ids.restaurantId];
    return { params, query };
  }
}

export const categoryQueries = new CategoryQueries();
