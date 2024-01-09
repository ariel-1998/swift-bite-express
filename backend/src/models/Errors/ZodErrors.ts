// import { FunctionError } from "./ErrorConstructor";

// export function handleZodError(err: ZodError, schemaName: string) {
//   const firstError = err.errors[0];

//   switch (firstError.path) {
//     case "username":
//       throw new FunctionError(`${schemaName} - ${firstError.message}`, 1001);
//     case "password":
//       throw new FunctionError(`${schemaName} - ${firstError.message}`, 1002);
//     default:
//       throw new FunctionError(`${schemaName} - Validation failed`, 1000);
//   }
// }

// //   class ZodErrorHandlers {
// //     private throw
// //   }
