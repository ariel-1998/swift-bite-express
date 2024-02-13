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

  getSingleRestaurantQuery(restaurantId: number): TransactionQuery {
    // const addressCols = DB.tables.addresses.columns;
    // const addressTableName = DB.tables.addresses.tableName;
    //NEED to add join statement

    //     SELECT
    //     restaurant.*,
    //     JSON_OBJECT(
    //         'address_id', addr.address_id,
    //         'street', addr.street,
    //         'city', addr.city,
    //         'state', addr.state,
    //         'country', addr.country
    //     ) AS address
    // FROM
    //     restaurant
    // JOIN
    //     addresses AS addr ON restaurant.address_id = addr.address_id
    // WHERE
    //     restaurant_id = ?;
    const query = `SELECT * FROM ${tableName} WHERE ${columns.id} = ?`;
    const params: MixedArray = [restaurantId];
    return { params, query };
  }
}

export const restaurantQueries = new RestaurantQueries();
