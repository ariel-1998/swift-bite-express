import { MixedArray, TransactionQuery } from "../dbConfig";
import { DB } from "../tables";

const { columns, tableName } = DB.tables.restaurants;
type RestaurantWithoutId = {
  name: string;
  imgUrl: string | null;
  imgPublicId: string | null;
};
class RestaurantQueries {
  addRestaurant(restaurant: RestaurantWithoutId): TransactionQuery {
    const query = `
        INSERT INTO ${tableName}
        (${columns.name}, ${columns.imgUrl}, ${columns.imgPublicId}) 
        VALUES(?, ?, ?)
    `;
    const params: MixedArray = [
      restaurant.name,
      restaurant.imgUrl,
      restaurant.imgPublicId,
    ];
    return { params, query };
  }

  getSingleRestaurantById(restaurantId: number): TransactionQuery {
    const addressCols = DB.tables.addresses.columns;
    const addressTableName = DB.tables.addresses.tableName;
    const combineCols = DB.tables.restaurant_owner_address.columns;
    const combineTableName = DB.tables.restaurant_owner_address.tableName;
    //NEED to add join statement

    const query = `
    SELECT ${addressTableName}.*, ${tableName}.${columns.name}, 
    ${tableName}.${columns.imgUrl}, ${tableName}.${columns.imgPublicId}
    FROM ${tableName}
    LEFT JOIN ${combineTableName} ON ${tableName}.${columns.id} = ${combineTableName}.${combineCols.restaurantId}
    LEFT JOIN ${addressTableName} on ${addressTableName}.${addressCols.id} = ${combineTableName}.${combineCols.addressId}
    where ${tableName}.${columns.id} = ?
    `;
    // const query = `SELECT * FROM ${tableName} WHERE ${columns.id} = ?`;
    const params: MixedArray = [restaurantId];
    return { params, query };
  }

  deleteRestaurant() {}
}

export const restaurantQueries = new RestaurantQueries();
