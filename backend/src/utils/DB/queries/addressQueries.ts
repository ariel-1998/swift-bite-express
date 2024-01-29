import { getCoordsAndturnUndefinedToNull } from "../../nominatimGeocoding";
import { MixedArray, TransactionQuery } from "../dbConfig";
import { DB } from "../tables";

type AddressObjArg = Awaited<
  ReturnType<typeof getCoordsAndturnUndefinedToNull>
>;
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
      addressObj.coordinates,
    ];
    const query = `INSERT INTO ${tableName} 
    (${columns.building}, ${columns.country}, ${columns.state}, ${columns.street}, ${columns.city}, ${columns.apartment}, ${columns.entrance}, ${columns.coordinates})
    VALUES(?,?,?,?,?,?,?,?)`;
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
      coordinates,
    } = addressObj;
    const query = `
    UPDATE ${tableName}
    SET ${columns.apartment} = ?,
    SET ${columns.building} = ?,
    SET ${columns.city} = ?,
    SET ${columns.country} = ?,
    SET ${columns.entrance} = ?,
    SET ${columns.state} = ?,
    SET ${columns.street} = ?,
    SET ${columns.coordinates} = ?
    WHERE ${columns.id} = ?`;
    const params: MixedArray = [
      apartment,
      building,
      city,
      country,
      entrance,
      state,
      street,
      coordinates,
      addressId,
    ];
    return { params, query };
  }

  deleteAddressQuery(addressId: number): TransactionQuery {
    const { columns, tableName } = DB.tables.addresses;
    const query = `DELETE FROM ${tableName} WHERE ${columns.id} = ?`;
    const params: MixedArray = [addressId];
    return { params, query };
  }
}

export const addressQueries = new AddressQueries();
