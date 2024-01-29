import { MixedArray, TransactionQuery } from "../dbConfig";
import { DB } from "../tables";

const { columns, tableName } = DB.tables.restaurants;
type RestaurantWithoutId = {
  name: string;
  imgUrl: string | null;
};
class RestaurantQueries {
  addRestaurant(restaurant: RestaurantWithoutId): TransactionQuery {
    const query = `
        INSERT INTO ${tableName}
        (${columns.name}, ${columns.imgUrl})
        VALUES(?, ?)
    `;
    const params: MixedArray = [restaurant.name, restaurant.imgUrl];
    return { params, query };
  }
  getSingleRestaurantQuery(restaurantId: number): TransactionQuery {
    const query = `SELECT * FROM ${tableName} WHERE ${columns.id} = ?`;
    const params: MixedArray = [restaurantId];
    return { params, query };
  }
}

export const restaurantQueries = new RestaurantQueries();
