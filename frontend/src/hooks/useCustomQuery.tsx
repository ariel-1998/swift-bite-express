// import { QueryFunction, QueryKey, useQuery } from "@tanstack/react-query";

// type UseCustomQueryProps<TData> = {
//   queryKey: QueryKey;
//   queryFn: QueryFunction<TData, QueryKey, never>;
//   onSuccess?: (data: TData) => void;
//   onError?: (error: unknown) => void;
//   enabled?: boolean;
// };

// const useCustomQuery = <T,>({
//   queryFn,
//   onSuccess,
//   onError,
//   queryKey,
//   enabled = true,
// }: UseCustomQueryProps<T>) => {
//   const dataObj = useQuery({
//     queryKey,
//     queryFn: async (context) => {
//       try {
//         const data = await queryFn(context);
//         if (onSuccess) onSuccess(data);
//         return data;
//       } catch (error) {
//         if (onError) onError(error);
//         throw error;
//       }
//     },
//     enabled,
//   });
//   return dataObj;
// };

// export default useCustomQuery;

import {
  QueryFunction,
  QueryKey,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";

type UseCustomQueryProps<TData, TContext extends QueryKey> = {
  // queryKey: QueryKey;
  queryFn: QueryFunction<TData, QueryKey, TContext>;
  onSuccess?: (data: TData) => void;
  onError?: (error: unknown) => void;
  // enabled?: boolean;
} & UseQueryOptions<TData, unknown, TData, TContext>;

const useCustomQuery = <T, TContext extends QueryKey>({
  queryFn,
  onSuccess,
  onError,
  queryKey,
  ...restOptions
}: UseCustomQueryProps<T, TContext>) => {
  const dataObj = useQuery({
    queryKey,
    queryFn: async (context) => {
      try {
        const data = await queryFn(context);
        if (onSuccess) onSuccess(data);
        return data;
      } catch (error) {
        if (onError) onError(error);
        throw error;
      }
    },
    ...restOptions,
  });
  return dataObj;
};

export default useCustomQuery;
