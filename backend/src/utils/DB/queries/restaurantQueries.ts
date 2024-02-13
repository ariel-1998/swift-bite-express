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
    LEFT JOIN ${addressTableName} ON ${addressTableName}.${addressCols.id} = ${combineTableName}.${combineCols.addressId}
    WHERE ${tableName}.${columns.id} = ?
    `;
    // const query = `SELECT * FROM ${tableName} WHERE ${columns.id} = ?`;
    const params: MixedArray = [restaurantId];
    return { params, query };
  }

  searchRestaurantByName(
    search: string,
    longitude: number,
    latitude: number
  ): TransactionQuery {
    //need to select from db based on the location of the user
    const { columns: combinedCols, tableName: combined } =
      DB.tables.restaurant_owner_address;
    const { columns: addressCols, tableName: addresses } = DB.tables.addresses;

    const query = `
    SELECT ${tableName}.*
    FROM ${tableName}
    JOIN ${combined} ON ${tableName}.${columns.id} = ${combined}.${combinedCols.restaurantId}
    JOIN ${addresses} ON ${combined}.${combinedCols.addressId} = ${addresses}.${addressCols.id}
    WHERE (
      6371 * acos(
        cos(radians(?)) * cos(radians(${addresses}.${addressCols.latitude})) * 
        cos(radians(${addresses}.${addressCols.longitude}) - radians(?)) +
      sin(radians(?)) * sin(radians(${addresses}.${addressCols.latitude}))
      )
    ) <= 20 AND ${tableName}.${columns.name} LIKE %?%`;
    const params: MixedArray = [latitude, longitude, latitude, search];
    // JOIN restaurant_owner_address roa ON r.id = roa.restaurantId
    // JOIN addresses a ON roa.addressId = a.id
    // WHERE
    //   (
    //     6371 * acos(
    //       cos(radians(32.08996360)) * cos(radians(a.latitude)) * cos(radians(a.longitude) - radians(34.88061490)) +
    //       sin(radians(32.08996360)) * sin(radians(a.latitude))
    //     )
    //   ) <= 20 AND r.name LIKE "%a%"
    return { params, query };
  }

  deleteRestaurant() {}
}

export const restaurantQueries = new RestaurantQueries();
