import { RestaurantSchema } from "../../../models/Restaurant";
import { MixedArray, TransactionQuery } from "../dbConfig";
import { DB } from "../tables";

const { columns, tableName } = DB.tables.restaurants;

type RestaurantWithoutId = Omit<RestaurantSchema, "id">;

const DISTANCE = 20;
const PAGE_LIMIT = 30;
const SEARCH_LIMIT = 15;
const generateOffset = (page: number, limit: number) => (page - 1) * limit;

class RestaurantQueries {
  addRestaurant(restaurant: RestaurantWithoutId): TransactionQuery {
    const query = `
        INSERT INTO ${tableName}
        (${columns.name}, ${columns.imgPublicId}, ${columns.logoPublicId}) 
        VALUES(?, ?, ?)
    `;
    const params: MixedArray = [
      restaurant.name,
      restaurant.imgPublicId,
      restaurant.logoPublicId,
    ];
    return { params, query };
  }

  getSingleRestaurantById(restaurantId: number): TransactionQuery {
    const addressCols = DB.tables.addresses.columns;
    const addresses = DB.tables.addresses.tableName;
    const combineCols = DB.tables.restaurant_owner_address.columns;
    const combineTableName = DB.tables.restaurant_owner_address.tableName;

    const query = `
    SELECT ${tableName}.*, 
    ${addresses}.${addressCols.id} as addressId, 
    ${addresses}.${addressCols.apartment}, 
    ${addresses}.${addressCols.building}, 
    ${addresses}.${addressCols.city}, 
    ${addresses}.${addressCols.country}, 
    ${addresses}.${addressCols.entrance}, 
    ${addresses}.${addressCols.latitude}, 
    ${addresses}.${addressCols.longitude}, 
    ${addresses}.${addressCols.state}, 
    ${addresses}.${addressCols.street}
    FROM ${tableName}
    LEFT JOIN ${combineTableName} ON ${tableName}.${columns.id} = ${combineTableName}.${combineCols.restaurantId}
    LEFT JOIN ${addresses} ON ${addresses}.${addressCols.id} = ${combineTableName}.${combineCols.addressId}
    WHERE ${tableName}.${columns.id} = ?
    `;
    const params: MixedArray = [restaurantId];
    return { params, query };
  }

  searchRestaurantByName(
    search: string,
    longitude: number,
    latitude: number,
    page: number
  ): TransactionQuery {
    const { columns: combinedCols, tableName: combined } =
      DB.tables.restaurant_owner_address;
    const { columns: addressCols, tableName: addresses } = DB.tables.addresses;
    const offset = generateOffset(page, SEARCH_LIMIT);

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
    LIMIT ${SEARCH_LIMIT} OFFSET ${offset}
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
    const offset = generateOffset(page, PAGE_LIMIT);
    const query = `
    SELECT ${tableName}.*, 
    ${addresses}.${addressCols.id} as addressId, 
    ${addresses}.${addressCols.apartment}, 
    ${addresses}.${addressCols.building}, 
    ${addresses}.${addressCols.city}, 
    ${addresses}.${addressCols.country}, 
    ${addresses}.${addressCols.entrance}, 
    ${addresses}.${addressCols.latitude}, 
    ${addresses}.${addressCols.longitude}, 
    ${addresses}.${addressCols.state}, 
    ${addresses}.${addressCols.street}
    FROM ${tableName}
    JOIN ${combined} ON ${tableName}.${columns.id} = ${combined}.${combinedCols.restaurantId}
    JOIN ${addresses} ON ${combined}.${combinedCols.addressId} = ${addresses}.${addressCols.id}
    WHERE (
      6371 * acos(
        cos(radians(?)) * cos(radians(${addresses}.${addressCols.latitude})) * 
        cos(radians(${addresses}.${addressCols.longitude}) - radians(?)) +
      sin(radians(?)) * sin(radians(${addresses}.${addressCols.latitude}))
      )
    ) <= ${DISTANCE} LIMIT ${PAGE_LIMIT} OFFSET ${offset}
    `;
    const params: MixedArray = [latitude, longitude, latitude];
    return { params, query };
  }

  updateRestaurantImgPublicId(
    restaurantId: number,
    imgPublicId: string
  ): TransactionQuery {
    const query = `
    UPDATE ${tableName}
    SET ${columns.imgPublicId} = ?
    WHERE ${columns.id} = ?
    `;
    const params: MixedArray = [imgPublicId, restaurantId];
    return { params, query };
  }
  updateRestaurantlogoPublicId(
    restaurantId: number,
    logoPublicId: string
  ): TransactionQuery {
    const query = `
    UPDATE ${tableName}
    SET ${columns.logoPublicId} = ?
    WHERE ${columns.id} = ?
    `;
    const params: MixedArray = [logoPublicId, restaurantId];
    return { params, query };
  }
  updateRestaurantName(
    restaurantId: number,
    restaurantName: string
  ): TransactionQuery {
    const query = `
    UPDATE ${tableName}
    SET ${columns.name} = ?
    WHERE ${columns.id} = ?
    `;
    const params: MixedArray = [restaurantName, restaurantId];
    return { params, query };
  }
  getAllOwnerRestaurants(userId: number): TransactionQuery {
    const { columns: combinedCols, tableName: combined } =
      DB.tables.restaurant_owner_address;
    const { columns: addressCols, tableName: addresses } = DB.tables.addresses;
    const query = `
    SELECT ${tableName}.*,
    ${addresses}.${addressCols.id} as addressId, 
    ${addresses}.${addressCols.apartment}, 
    ${addresses}.${addressCols.building}, 
    ${addresses}.${addressCols.city}, 
    ${addresses}.${addressCols.country}, 
    ${addresses}.${addressCols.entrance}, 
    ${addresses}.${addressCols.latitude}, 
    ${addresses}.${addressCols.longitude}, 
    ${addresses}.${addressCols.state}, 
    ${addresses}.${addressCols.street}
    FROM ${tableName}
    LEFT JOIN ${combined} ON ${combined}.${combinedCols.restaurantId} = ${tableName}.${columns.id}
    LEFT JOIN ${addresses} ON ${combined}.${combinedCols.addressId} = ${addresses}.${addressCols.id}
    WHERE ${combined}.${combinedCols.userId} = ?
    `;
    const params: MixedArray = [userId];
    return { params, query };
  }

  // deleteRestaurant() {}
}

export const restaurantQueries = new RestaurantQueries();
