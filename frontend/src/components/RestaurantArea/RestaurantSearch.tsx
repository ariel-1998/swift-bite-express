import React, { useMemo, useState } from "react";
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
import useScrollFetch from "../../hooks/useScrollFetch";
import {
  NestedRestaurantAndAddress,
  Restaurant,
} from "../../models/Restaurant";
import { Role } from "../../models/User";
import useOwnerRestaurants from "../../hooks/useOwnerRestaurants";

type RestaurantSearchProps = {
  openSearch: boolean;
  toggleOpenSearch: () => void;
};

const RestaurantSearch: React.FC<RestaurantSearchProps> = ({
  openSearch,
  toggleOpenSearch,
}) => {
  const { user } = useUserInfo();
  const [search, setSearch] = useState("");
  const isSmaller = useScreenSize("lg");

  const { loading, debounce: debounceSearch } = useDebounce({
    wait: 500,
    fn: updateSeach,
  });

  function updateSeach(e: React.ChangeEvent<HTMLInputElement>) {
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

      {user?.role === Role.user && (
        <UserRestaurantSearch
          loading={loading}
          search={search}
          openSearch={openSearch}
          toggleOpenSearch={toggleOpenSearch}
        />
      )}
      {user?.role === Role.owner && (
        <OwnerRestaurantSearch
          loading={loading}
          search={search}
          openSearch={openSearch}
          toggleOpenSearch={toggleOpenSearch}
        />
      )}
    </div>
  );
};

export default RestaurantSearch;

type UserRestaurantSearchProps = {
  loading: boolean;
  search: string;
} & RestaurantSearchProps;
function UserRestaurantSearch({
  openSearch,
  toggleOpenSearch,
  loading,
  search,
}: UserRestaurantSearchProps) {
  const { address } = useUserInfo();

  const {
    dataObj: { isLoading, isError, data },
    observer,
  } = useScrollFetch<Restaurant>({
    queryKey: queryKeys.restaurants.searchRestaurantsByName(search, address),
    pageLimit: CONSTANTS.RESTAURANT_SEARCH_PAGE_LIMIT,
    enabled: !!search,
    queryFn: ({ pageParam }) =>
      restaurantService.searchRestaurantsByName(search!, pageParam, {
        latitude: address?.latitude,
        longitude: address?.longitude,
      }),
  });

  return (
    <>
      {(isLoading || loading) && "loading..."}
      {isError && "error"}
      {search && data && openSearch && (
        <div className="relative">
          <div
            onClick={toggleOpenSearch}
            className="absolute top-0 w-full bg-white"
          >
            {data?.pages.map((page, i) => (
              <DisplaySearchResults data={page} observer={observer} key={i} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function OwnerRestaurantSearch({
  loading,
  openSearch,
  search,
  toggleOpenSearch,
}: UserRestaurantSearchProps) {
  const { data, isLoading, isError } = useOwnerRestaurants();
  const filteredData = useMemo(() => {
    return data?.filter((restaurant) => restaurant.name.includes(search)) || [];
  }, [data, search]);
  return (
    <>
      {search && data && openSearch && (
        <div className="relative">
          <div
            onClick={toggleOpenSearch}
            className="absolute top-0 w-full bg-white"
          >
            {(isLoading || loading) && "loading..."}
            {isError && "error"}
            {filteredData && <DisplaySearchResults data={filteredData} />}
          </div>
        </div>
      )}
    </>
  );
}

type DisplaySearchResultsProps = {
  data: (Restaurant | NestedRestaurantAndAddress)[];
  observer?: (node: HTMLAnchorElement) => void;
};
function DisplaySearchResults({ data, observer }: DisplaySearchResultsProps) {
  return (
    <>
      {data.map((restaurant, i) => {
        if (data.length === i + 1 && observer) {
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
      })}
    </>
  );
}
