// import { NextFunction, Request, Response } from "express";
// import { User } from "../models/User";
// import { DB } from "../utils/DB/tables";

// type GetAddressByIdParams = {
//   addressId: string;
// };

// const getAddressById = (
//   req: Request<GetAddressByIdParams>,
//   res: Response<User>,
//   next: NextFunction
// ) => {
//   const { addressId } = req.params;
//   const { columns, tableName } = DB.tables.addresses;
//   const query = `SELECT * FROM ${tableName} WHERE ${columns.id} = ?`;

// };
