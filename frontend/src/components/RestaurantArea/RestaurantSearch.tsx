import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useCallback, useRef, useState } from "react";
import { restaurantService } from "../../services/restaurantService";
import Input from "../Customs/Input";
import useUserInfo from "../../hooks/useUserInfo";
import { CONSTANTS } from "../../utils/constants";
import RestaurantSearchResultCard from "./RestaurantSearchResultCard";
import queryKeys from "../../utils/queryKeys";

const RestaurantSearch: React.FC = () => {
  const [search, setSearch] = useState("");
  const { address } = useUserInfo();
  const observerRef = useRef<IntersectionObserver | null>(null);

  const {
    data,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    isError,
    isLoading,
  } = useInfiniteQuery({
    //need to check if another key is required to remember the page number
    queryKey: queryKeys.restaurants.searchRestaurantsByName(search, address),
    queryFn: ({ pageParam }) =>
      restaurantService.searchRestaurantsByName(search!, pageParam, {
        latitude: address?.latitude,
        longitude: address?.longitude,
      }),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length === CONSTANTS.RESTAURANT_SEARCH_PAGE_LIMIT) {
        return allPages.length + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled: !!search,
  });

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

      return () => {
        if (observerRef.current) {
          observerRef.current.disconnect();
          observerRef.current = null;
        }
      };
    },
    [fetchNextPage, hasNextPage, isError, isFetchingNextPage]
  );

  return (
    <div>
      <Input
        placeholder="Serach Restaurants"
        onChange={(e) => setSearch(e.target.value)}
      />
      {data?.pages.map((page) =>
        page.map((restaurant, i) => {
          if (page.length === i + 1) {
            return (
              <RestaurantSearchResultCard
                restaurant={restaurant}
                key={restaurant.id}
                ref={observer}
              />
            );
          }
          return (
            <RestaurantSearchResultCard
              restaurant={restaurant}
              key={restaurant.id}
            />
          );
        })
      )}
      {isLoading && "loading..."}
      {isError && "error"}
    </div>
  );
};

export default RestaurantSearch;
