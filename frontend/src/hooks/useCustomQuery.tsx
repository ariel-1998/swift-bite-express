import { QueryFunction, QueryKey, useQuery } from "@tanstack/react-query";

type UseCustomQueryProps<TData> = {
  queryKey: QueryKey;
  queryFn: QueryFunction<TData, QueryKey, never>;
  onSuccess?: (data: TData) => void;
  onError?: (error: unknown) => void;
  enabled?: boolean;
};

const useCustomQuery = <T,>({
  queryFn,
  onSuccess,
  onError,
  queryKey,
  enabled = true,
}: UseCustomQueryProps<T>) => {
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
    enabled,
  });
  return dataObj;
};

export default useCustomQuery;
