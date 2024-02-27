import React, { useState } from "react";
import { restaurantService } from "../../../services/restaurantService";
import Input from "../../Customs/Input";
import useUserInfo from "../../../hooks/useUserInfo";
import { CONSTANTS } from "../../../utils/constants";
import queryKeys from "../../../utils/queryKeys";
import useScreenSize from "../../../hooks/useScreenSize";
import { FaSearch } from "react-icons/fa";
import { FaWindowClose } from "react-icons/fa";
import useDebounce from "../../../hooks/useDebounce";
import useScrollFetch from "../../../hooks/useScrollFetch";
import { Restaurant } from "../../../models/Restaurant";
import RestaurantSearchList from "./RestaurantSearchList";

type RestaurantSearchProps = {
  openSearch: boolean;
  toggleOpenSearch: () => void;
};

const RestaurantSearch: React.FC<RestaurantSearchProps> = ({
  openSearch,
  toggleOpenSearch,
}) => {
  const [search, setSearch] = useState("");
  const isSmaller = useScreenSize("lg");
  const { address } = useUserInfo();

  const { loading, debounce: debounceSearch } = useDebounce({
    wait: 500,
    fn: updateSeach,
  });

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
  console.log(data);
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
      <>
        {(isLoading || loading) && "loading..."}
        {isError && "error"}
        {search && data && ((isSmaller && openSearch) || !isSmaller) && (
          <div className="relative">
            <div
              onClick={toggleOpenSearch}
              className="absolute top-0 w-full bg-white"
            >
              {data?.pages.map((page, i) => (
                <RestaurantSearchList data={page} observer={observer} key={i} />
              ))}
            </div>
          </div>
        )}
      </>
    </div>
  );
};

export default RestaurantSearch;
