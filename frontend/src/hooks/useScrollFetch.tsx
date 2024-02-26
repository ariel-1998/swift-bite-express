import { useCallback, useRef } from "react";
import { QueryFunction, useInfiniteQuery } from "@tanstack/react-query";

type UseScrollFetchProps<Data> = {
  queryKey: unknown[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  queryFn: QueryFunction<Data[], any, number> | undefined;
  pageLimit: number;
  enabled: boolean;
};

const useScrollFetch = <T,>({
  queryKey,
  queryFn,
  pageLimit,
  enabled,
}: UseScrollFetchProps<T>) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const dataObj = useInfiniteQuery({
    //need to check if another key is required to remember the page number
    queryKey,
    queryFn,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length === pageLimit) {
        return allPages.length + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled,
  });

  const { hasNextPage, isFetchingNextPage, fetchNextPage, isError } = dataObj;

  const observer = useCallback(
    (node: HTMLAnchorElement) => {
      if (isFetchingNextPage) return;
      if (observerRef.current && isError) {
        return observerRef.current.disconnect();
      }
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) fetchNextPage();
      });

      if (node) observerRef.current.observe(node);

      // return () => {
      //   if (observerRef.current) {
      //     observerRef.current.disconnect();
      //     observerRef.current = null;
      //   }
      // };
    },
    [fetchNextPage, hasNextPage, isError, isFetchingNextPage]
  );

  return { observer, dataObj };
};

export default useScrollFetch;
{
  //user search restaurant
  // const observerRef = useRef<IntersectionObserver | null>(null);
  // const {
  //   data,
  //   hasNextPage,
  //   isFetchingNextPage,
  //   fetchNextPage,
  //   isError,
  //   isLoading,
  // } = useInfiniteQuery({
  //   //need to check if another key is required to remember the page number
  //   queryKey: queryKeys.restaurants.searchRestaurantsByName(search, address),
  //   queryFn: ({ pageParam }) =>
  //     restaurantService.searchRestaurantsByName(search!, pageParam, {
  //       latitude: "32.08996360000000000",
  //       longitude: "34.88061490000000000",
  //     }),
  //   getNextPageParam: (lastPage, allPages) => {
  //     if (lastPage.length === CONSTANTS.RESTAURANT_SEARCH_PAGE_LIMIT) {
  //       return allPages.length + 1;
  //     }
  //     return undefined;
  //   },
  //   initialPageParam: 1,
  //   enabled: !!search,
  // });
  // const observer = useCallback(
  //   (node: HTMLAnchorElement) => {
  //     if (isFetchingNextPage) return;
  //     if (observerRef.current && isError) {
  //       return observerRef.current.disconnect();
  //     }
  //     if (observerRef.current) observerRef.current.disconnect();
  //     observerRef.current = new IntersectionObserver((entries) => {
  //       if (entries[0].isIntersecting && hasNextPage) fetchNextPage();
  //     });
  //     if (node) observerRef.current.observe(node);
  //     return () => {
  //       if (observerRef.current) {
  //         observerRef.current.disconnect();
  //         observerRef.current = null;
  //       }
  //     };
  //   },
  //   [fetchNextPage, hasNextPage, isError, isFetchingNextPage]
  // );
}

{
  //restaurant card list
  // const observerRef = useRef<IntersectionObserver | null>(null);
  // const { data, hasNextPage, isFetchingNextPage, fetchNextPage, isError } =
  //   useInfiniteQuery({
  //     //need to check if another key is required to remember the page number
  //     queryKey: queryKeys.restaurants.getNearRestaurantsByPage(address),
  //     queryFn: ({ pageParam }) =>
  //       restaurantService.getNearRestaurantsByPage(pageParam, {
  //         latitude: address?.latitude,
  //         longitude: address?.longitude,
  //       }),
  //     getNextPageParam: (lastPage, allPages) => {
  //       if (lastPage.length === CONSTANTS.RESTAURANTS_PAGE_LIMIT) {
  //         return allPages.length + 1;
  //       }
  //       return undefined;
  //     },
  //     initialPageParam: 1,
  //   });
  // const observer = useCallback(
  //   (node: HTMLAnchorElement) => {
  //     if (isFetchingNextPage) return;
  //     if (observerRef.current && isError) {
  //       return observerRef.current.disconnect();
  //     }
  //     if (observerRef.current) observerRef.current.disconnect();
  //     observerRef.current = new IntersectionObserver((entries) => {
  //       if (entries[0].isIntersecting && hasNextPage) fetchNextPage();
  //     });
  //     if (node) observerRef.current.observe(node);
  //     //check if needed
  //     return () => {
  //       if (observerRef.current) {
  //         observerRef.current.disconnect();
  //         observerRef.current = null;
  //       }
  //     };
  //   },
  //   [fetchNextPage, hasNextPage, isError, isFetchingNextPage]
  // );
}
