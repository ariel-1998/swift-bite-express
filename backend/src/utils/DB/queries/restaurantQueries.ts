import { MixedArray, TransactionQuery } from "../dbConfig";
import { DB } from "../tables";

const { columns, tableName } = DB.tables.restaurants;

type RestaurantWithoutId = {
  name: string;
  imgUrl: string | null;
  imgPublicId: string | null;
};

const DISTANCE = 20;
const LIMIT = 50;
const generateOffset = (page: number) => (page - 1) * LIMIT;

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
    const params: MixedArray = [restaurantId];
    return { params, query };
  }

  searchRestaurantByName(
    search: string,
    longitude: number,
    latitude: number
  ): TransactionQuery {
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
    ) <= ${DISTANCE} AND ${tableName}.${columns.name} LIKE ?
    `;
    const params: MixedArray = [latitude, longitude, latitude, `%${search}%`];
    return { params, query };
  }

  //need to create the get routes
  getRestaurantsByPage(
    page: number,
    longitude: number,
    latitude: number
  ): TransactionQuery {
    const { columns: combinedCols, tableName: combined } =
      DB.tables.restaurant_owner_address;
    const { columns: addressCols, tableName: addresses } = DB.tables.addresses;
    const offset = generateOffset(page);
    const query = `
    SELECT ${addresses}.*, ${tableName}.${columns.name}, 
    ${tableName}.${columns.imgUrl}, ${tableName}.${columns.imgPublicId}
    FROM ${tableName}
    JOIN ${combined} ON ${tableName}.${columns.id} = ${combined}.${combinedCols.restaurantId}
    JOIN ${addresses} ON ${combined}.${combinedCols.addressId} = ${addresses}.${addressCols.id}
    WHERE (
      6371 * acos(
        cos(radians(?)) * cos(radians(${addresses}.${addressCols.latitude})) * 
        cos(radians(${addresses}.${addressCols.longitude}) - radians(?)) +
      sin(radians(?)) * sin(radians(${addresses}.${addressCols.latitude}))
      )
    ) <= ${DISTANCE} LIMIT ${LIMIT} OFFSET ${offset}
    `;
    const params: MixedArray = [latitude, longitude, latitude];
    return { params, query };
  }

  // deleteRestaurant() {}
}

export const restaurantQueries = new RestaurantQueries();
