import React, { useCallback, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { restaurantService } from "../../services/restaurantService";
import { CONSTANTS } from "../../utils/constants";
import RestaurantCard from "./RestaurantCard";
import useUserInfo from "../../hooks/useUserInfo";

const RestaurantCardList: React.FC = () => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const { address } = useUserInfo();
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage, isError } =
    useInfiniteQuery({
      queryKey: ["restaurants", "page"],
      queryFn: ({ pageParam }) =>
        restaurantService.getNearRestaurantsByPage(pageParam, {
          latitude: address?.latitude,
          longitude: address?.longitude,
        }),
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage.length === CONSTANTS.RESTAURANTS_PAGE_LIMIT) {
          return allPages.length + 1;
        }
        return undefined;
      },
      initialPageParam: 1,
    });

  const observer = useCallback(
    (node: HTMLDivElement) => {
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
          observerRef.current = null; // Reset the ref when unmounting
        }
      };
    },
    [fetchNextPage, hasNextPage, isError, isFetchingNextPage]
  );
  return (
    <div className="">
      {data?.pages.map((page) =>
        page.map((restaurant, i) => {
          if (page.length === i + 1) {
            return (
              <RestaurantCard
                restaurant={restaurant}
                key={restaurant.id}
                ref={observer}
              />
            );
          }
          return <RestaurantCard restaurant={restaurant} key={restaurant.id} />;
        })
      )}
    </div>
  );
};

export default RestaurantCardList;
