import mysql, {
  PoolOptions,
  RowDataPacket,
  PoolConnection,
  Pool,
} from "mysql2/promise";
import { FunctionError } from "../../models/Errors/ErrorConstructor";
import { SQLTableNames } from "./tables";

export const config: PoolOptions = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 100,
  queueLimit: 0,
};

export const pool: Pool = mysql.createPool(config);
export type MixedArray = (string | number | null)[];

export type TransactionQuery = {
  query: string;
  params: MixedArray;
};
export async function executeQuery<T>(
  connection: PoolConnection,
  query: TransactionQuery,
  tableName: SQLTableNames | null
) {
  try {
    const data = await connection.execute<T & RowDataPacket[]>(
      query.query,
      query.params
    );
    return data;
  } catch (error) {
    const { code, message } = sqlErrorHandler(error, tableName);
    throw new FunctionError(message, code);
  }
}

export async function executeSingleQuery<T>(
  query: string,
  params: MixedArray,
  tableName: SQLTableNames | null
) {
  let connection: PoolConnection | undefined = undefined;
  try {
    connection = await pool.getConnection();
    const data = await executeQuery<T>(
      connection,
      { query, params },
      tableName
    );
    return data;
  } finally {
    connection?.release();
  }
}

function sqlErrorHandler(error: unknown, tableName: SQLTableNames | null) {
  const message =
    "An error occurred while processing your request. Please try again later.";
  const code = 500;
  if (
    error &&
    typeof error === "object" &&
    "code" in error &&
    typeof error.code === "string"
  ) {
    switch (tableName) {
      case "auth_provider":
        return auth_provider_table_errors(error.code, message, code);
      case "addresses":
        return addresses_table_errors(error.code, message, code);
      case "users":
        return users_table_errors(error.code, message, code);
      case "restaurants":
        return restaurants_table_errors(error.code, message, code);
      case "restaurant_owner_address":
        return restaurant_owner_address_table_errors(error.code, message, code);
      case "categories":
        return categories_table_errors(error.code, message, code);
      case "menu_items":
        return menu_items_table_errors(error.code, message, code);
      case "sauces":
        return sauces_table_errors(error.code, message, code);
      case "extras":
        return extras_table_errors(error.code, message, code);
      case "menu_items_category":
        return menu_items_category_table_errors(error.code, message, code);
      case null: {
        return { message, code };
      }
      default:
        return { message, code };
    }
  }

  return { message, code };
}

function auth_provider_table_errors(
  errCode: string,
  defaultMsg: string,
  defaultCode: number
) {
  let message = "";
  let code = 0;
  switch (errCode) {
    //insert
    case "ER_DUP_ENTRY": {
      message =
        "Failed to add authentication provider. Provider ID already exists.";
      code = 409;
      break;
    }
    case "ER_ROW_NOT_FOUND": {
      message = "Provider ID not found.";
      code = 404;
      break;
    }
    default: {
      message = defaultMsg;
      code = defaultCode;
    }
  }
  return { message, code };
}
function addresses_table_errors(
  errCode: string,
  defaultMsg: string,
  defaultCode: number
) {
  let message = "";
  let code = 0;

  switch (errCode) {
    case "ER_ROW_NOT_FOUND": {
      message = "Could not coplete operation, Address not found.";
      code = 404;
      break;
    }
    default: {
      message = defaultMsg;
      code = defaultCode;
    }
  }
  return { message, code };
}
function users_table_errors(
  errCode: string,
  defaultMsg: string,
  defaultCode: number
) {
  let message = "";
  let code = 0;

  switch (errCode) {
    case "ER_DUP_ENTRY": {
      message = "Duplicate Error: Email address already exists.";
      code = 409;
      break;
    }
    case "ER_ROW_NOT_FOUND": {
      message = "Could not complete operation, User not found.";
      code = 404;
      break;
    }
    case "ER_NO_REFERENCED_ROW": {
      message =
        "Failed to complete operation, Invalid reference to the parent record in the database.";
      code = 422;
      break;
    }

    default: {
      message = defaultMsg;
      code = defaultCode;
    }
  }
  return { message, code };
}
function restaurants_table_errors(
  errCode: string,
  defaultMsg: string,
  defaultCode: number
) {
  let message = "";
  let code = 0;

  switch (errCode) {
    case "ER_DUP_ENTRY": {
      message = "Duplicate Error: Restaurant name already exists.";
      code = 409;
      break;
    }

    case "ER_ROW_NOT_FOUND": {
      message = "Restaurant ID not found.";
      code = 404;
      break;
    }

    default: {
      message = defaultMsg;
      code = defaultCode;
    }
  }
  return { message, code };
}
function restaurant_owner_address_table_errors(
  errCode: string,
  defaultMsg: string,
  defaultCode: number
) {
  let message = "";
  let code = 0;

  switch (errCode) {
    case "ER_DUP_ENTRY": {
      message =
        "Duplicate Error: Owner already associated with this restaurant.";
      code = 409;
      break;
    }

    case "ER_ROW_NOT_FOUND": {
      message =
        "Failed to complete operation, Restaurant or owner ID not found.";
      code = 404;
      break;
    }

    case "ER_NO_REFERENCED_ROW": {
      message =
        "Failed to complete operation, Invalid reference to the parent record in the database.";
      code = 422;
      break;
    }

    default: {
      message = defaultMsg;
      code = defaultCode;
    }
  }
  return { message, code };
}
function categories_table_errors(
  errCode: string,
  defaultMsg: string,
  defaultCode: number
) {
  let message = "";
  let code = 0;

  switch (errCode) {
    case "ER_DUP_ENTRY": {
      message =
        "Duplicate Error: Category name already exists for this restaurant.";
      code = 409;
      break;
    }

    case "ER_ROW_NOT_FOUND": {
      message = "Failed to complete operation, Category not found.";
      code = 404;
      break;
    }

    case "ER_NO_REFERENCED_ROW": {
      message =
        "Failed to complete operation, Invalid reference to the parent record in the database.";
      code = 422;
      break;
    }
    //might add this to other error that does have fk with no onDelete action in DB
    // case "ER_ROW_IS_REFERENCED": {
    //   message =
    //     "Failed to delete category. Category is referenced by other entities.";
    //   code = 409;
    //   break;
    // }

    default: {
      message = defaultMsg;
      code = defaultCode;
    }
  }
  return { message, code };
}
function menu_items_table_errors(
  errCode: string,
  defaultMsg: string,
  defaultCode: number
) {
  let message = "";
  let code = 0;

  switch (errCode) {
    case "ER_DUP_ENTRY": {
      message =
        "Duplicate Error: Menu item name already exists for this restaurant.";
      code = 409;
      break;
    }

    case "ER_ROW_NOT_FOUND": {
      message = "Failed to complete operation, Menu item not found.";
      code = 404;
      break;
    }

    case "ER_NO_REFERENCED_ROW": {
      message =
        "Failed to complete operation, Invalid reference to the parent restaurant record in the database.";
      code = 422;
      break;
    }
    //might add this to other error that does have fk with no onDelete action in DB
    // case "ER_ROW_IS_REFERENCED": {
    //   message =
    //     "Failed to delete menu item. Menu item is referenced by other entities.";
    //   code = 409;
    //   break;
    // }

    default: {
      message = defaultMsg;
      code = defaultCode;
    }
  }
  return { message, code };
}
function sauces_table_errors(
  errCode: string,
  defaultMsg: string,
  defaultCode: number
) {
  let message = "";
  let code = 0;

  switch (errCode) {
    case "ER_DUP_ENTRY": {
      message =
        "Duplicate Error: Sauce name already exists for this restaurant.";
      code = 409;
      break;
    }

    case "ER_ROW_NOT_FOUND": {
      message = "Failed to complete operation, Sauce not found.";
      code = 404;
      break;
    }

    case "ER_NO_REFERENCED_ROW": {
      message =
        "Failed to complete operation, Invalid reference to the parent restaurant.";
      code = 422;
      break;
    }
    //might add this to other error that does have fk with no onDelete action in DB
    // case "ER_ROW_IS_REFERENCED": {
    //   message =
    //     "Failed to delete sauce. Sauce is referenced by other entities.";
    //   code = 409;
    //   break;
    // }

    default: {
      message = defaultMsg;
      code = defaultCode;
    }
  }
  return { message, code };
}
function extras_table_errors(
  errCode: string,
  defaultMsg: string,
  defaultCode: number
) {
  let message = "";
  let code = 0;

  switch (errCode) {
    case "ER_DUP_ENTRY": {
      message =
        "Duplicate Error: Extra name already exists for this menu item.";
      code = 409;
      break;
    }

    case "ER_ROW_NOT_FOUND": {
      message = "Failed to complete operation, Extra not found.";
      code = 404;
      break;
    }

    case "ER_NO_REFERENCED_ROW": {
      message =
        "Failed to complete operation, Invalid reference to the parent menu item or restaurant.";
      code = 422;
      break;
    }
    //might add this to other error that does have fk with no onDelete action in DB
    // case "ER_ROW_IS_REFERENCED": {
    //   message =
    //     "Failed to delete extra. Extra is referenced by other entities.";
    //   code = 409;
    //   break;
    // }

    default: {
      message = defaultMsg;
      code = defaultCode;
    }
  }
  return { message, code };
}
function menu_items_category_table_errors(
  errCode: string,
  defaultMsg: string,
  defaultCode: number
) {
  let message = "";
  let code = 0;

  switch (errCode) {
    case "ER_DUP_ENTRY": {
      message =
        "Duplicate Error: Category already associated with this menu item.";
      code = 409;
      break;
    }

    case "ER_ROW_NOT_FOUND": {
      message =
        "Failed to complete operation, Category or menu item not found.";
      code = 404;
      break;
    }

    case "ER_NO_REFERENCED_ROW": {
      message =
        "Failed to complete operation, Invalid reference to the parent menu item, category, or restaurant.";
      code = 422;
      break;
    }

    default: {
      message = defaultMsg;
      code = defaultCode;
    }
  }
  return { message, code };
}
