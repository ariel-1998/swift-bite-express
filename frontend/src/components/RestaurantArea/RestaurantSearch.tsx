import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useCallback, useRef, useState } from "react";
import { restaurantService } from "../../services/restaurantService";
import Input from "../Customs/Input";
import useUserInfo from "../../hooks/useUserInfo";
import { CONSTANTS } from "../../utils/constants";
import RestaurantSearchResultCard from "./RestaurantSearchResultCard";
import queryKeys from "../../utils/queryKeys";
import useScreenSize from "../../hooks/useScreenSize";
import { FaSearch } from "react-icons/fa";
import { FaWindowClose } from "react-icons/fa";
import useDebounce from "../../hooks/useDebounce";

type RestaurantSearchProps = {
  openSearch: boolean;
  toggleOpenSearch: () => void;
};

const RestaurantSearch: React.FC<RestaurantSearchProps> = ({
  openSearch,
  toggleOpenSearch,
}) => {
  const [search, setSearch] = useState("");
  const { address } = useUserInfo();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const isSmaller = useScreenSize("lg");
  const { loading, debounce: debounceSearch } = useDebounce({
    wait: 500,
    fn: updateSeach,
  });
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

  function updateSeach(e: React.ChangeEvent<HTMLInputElement>) {
    console.log("asdlknasdlnalskdnalskdndlkasndlkansdlknasdlkasndlkasnlksan");
    setSearch(e.target.value);
  }
  return (
    <div className={`w-full flex flex-col cursor-pointer`}>
      <div className="relative">
        {!isSmaller || openSearch ? (
          <>
            <Input
              className={`${isSmaller && openSearch && "indent-10"}`}
              placeholder="Serach Restaurants"
              onChange={debounceSearch}
            />
            {isSmaller && (
              <div
                className="absolute top-1/2 transform cursor-pointer -translate-y-2/4 left-2 text-3xl text-brown bg-transparent"
                onClick={() => {
                  setSearch("");
                  toggleOpenSearch();
                }}
              >
                <FaWindowClose />
              </div>
            )}
          </>
        ) : (
          <div
            className="border border-white rounded-full p-1.5 text-white"
            onClick={toggleOpenSearch}
          >
            <FaSearch className="text-md" />
          </div>
        )}
      </div>
      {(isLoading || loading) && "loading..."}
      {isError && "error"}
      {search && data && openSearch && (
        <div className="relative">
          <div
            onClick={toggleOpenSearch}
            className="absolute top-0 w-full bg-white"
          >
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
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantSearch;
