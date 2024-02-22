import { AddressSchema } from "../../../models/Address";
// import { getCoordsAndturnUndefinedToNull } from "../../nominatimGeocoding";
import { MixedArray, TransactionQuery } from "../dbConfig";
import { DB } from "../tables";

type AddressObjArg = Omit<AddressSchema, "id">;
// type AddressObjArg = Awaited<
//   ReturnType<typeof getCoordsAndturnUndefinedToNull>
// >;

class AddressQueries {
  getAddressByIdQuery(addressId: number): TransactionQuery {
    const { columns, tableName } = DB.tables.addresses;
    const query = `SELECT * FROM ${tableName} WHERE ${columns.id} = ?`;
    const params: MixedArray = [addressId];
    return { query, params };
  }

  AddAddressQuery(addressObj: AddressObjArg): TransactionQuery {
    const { columns, tableName } = DB.tables.addresses;
    const params: MixedArray = [
      addressObj.building,
      addressObj.country,
      addressObj.state,
      addressObj.street,
      addressObj.city,
      addressObj.apartment,
      addressObj.entrance,
      addressObj.longitude,
      addressObj.latitude,
    ];
    const query = `INSERT INTO ${tableName} 
    (${columns.building}, ${columns.country}, ${columns.state}, ${columns.street}, ${columns.city}, ${columns.apartment}, ${columns.entrance}, ${columns.longitude}, ${columns.latitude})
    VALUES(?,?,?,?,?,?,?,?,?)`;
    return { params, query };
  }

  updateAddressQuery(
    addressObj: AddressObjArg,
    addressId: number
  ): TransactionQuery {
    const { columns, tableName } = DB.tables.addresses;
    const {
      apartment,
      building,
      city,
      country,
      entrance,
      state,
      street,
      longitude,
      latitude,
    } = addressObj;
    const query = `
    UPDATE ${tableName}
    SET ${columns.apartment} = ?,
        ${columns.building} = ?,
        ${columns.city} = ?,
        ${columns.country} = ?,
        ${columns.entrance} = ?,
        ${columns.state} = ?,
        ${columns.street} = ?,
        ${columns.longitude} = ?,
        ${columns.latitude} = ?
    WHERE ${columns.id} = ?`;
    const params: MixedArray = [
      apartment,
      building,
      city,
      country,
      entrance,
      state,
      street,
      longitude,
      latitude,
      addressId,
    ];
    return { params, query };
  }

  // deleteAddressQuery(addressId: number): TransactionQuery {
  //   const { columns, tableName } = DB.tables.addresses;
  //   const query = `DELETE FROM ${tableName} WHERE ${columns.id} = ?`;
  //   const params: MixedArray = [addressId];
  //   return { params, query };
  // }
}

export const addressQueries = new AddressQueries();
