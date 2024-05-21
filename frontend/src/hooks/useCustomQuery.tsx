import {
  QueryFunction,
  QueryKey,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";

type UseCustomQueryProps<TData, TContext extends QueryKey> = {
  queryFn: QueryFunction<TData, QueryKey, TContext>;
  onSuccess?: (data: TData) => void;
  onError?: (error: unknown) => void;
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
