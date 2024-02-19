import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "react-router-dom";
import { restaurantService } from "../../../services/restaurantService";
import queryKeys from "../../../utils/queryKeys";
import UpdateRestaurantAddress from "./UpdateRestaurantAddress";
import UpdateRestaurantLogo from "./UpdateRestaurantLogo";
import UpdateRestaurantImage from "./UpdateRestaurantImage";
import UpdateRestaurantName from "./UpdateRestaurantName";
import AddRestaurantAddress from "../AddRestaurantAddress";

type FormNames = "name" | "logo" | "image" | "address";
export type UpdateRestaurantLocationState = { activeForm?: FormNames };
const searchParam = "activeForm";

const UpdateRestaurant: React.FC = () => {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeForm = (searchParams.get(searchParam) as FormNames) || "name";

  const { data, isLoading, isError } = useQuery({
    queryKey: queryKeys.restaurants.getSingleRestaurantById(+restaurantId!),
    queryFn: () => restaurantService.getSingleRestaurantById(+restaurantId!),
    enabled: !!restaurantId,
  });

  const setActiveForm = (formName: FormNames) => {
    setSearchParams((prev) => {
      prev.set(searchParam, formName);
      return prev;
    });
  };

  return (
    <>
      {isLoading && "loading..."}
      {isError && "error"}
      {data && (
        <div className="rounded m-auto mt-5 shadow-md border-secondary border-2 p-5 flex flex-col w-[95vw] sm:w-[500px]  bg-white">
          <ul className="flex font-bold justify-around mb-5  divide-x divide-solid">
            <li
              onClick={() => setActiveForm("name")}
              className="cursor-pointer grow hover:bg-secondary p-2 transition-colors text-center"
            >
              Name
            </li>
            <li
              onClick={() => setActiveForm("logo")}
              className="cursor-pointer grow hover:bg-secondary p-2 transition-colors text-center"
            >
              Logo
            </li>
            <li
              onClick={() => setActiveForm("logo")}
              className="cursor-pointer grow hover:bg-secondary p-2 transition-colors text-center"
            >
              Image
            </li>
            <li
              onClick={() => setActiveForm("address")}
              className="cursor-pointer grow hover:bg-secondary p-2 transition-colors text-center"
            >
              Address
            </li>
          </ul>

          <h1 className="text-center font-bold text-2xl ">
            Update {activeForm}
          </h1>

          {activeForm === "image" ? (
            <UpdateRestaurantImage restaurant={data} />
          ) : activeForm === "logo" ? (
            <UpdateRestaurantLogo restaurant={data} />
          ) : activeForm === "address" ? (
            data.address.id ? (
              <UpdateRestaurantAddress restaurant={data} />
            ) : (
              <AddRestaurantAddress restaurant={data} />
            )
          ) : (
            <UpdateRestaurantName restaurant={data} />
          )}
        </div>
      )}
    </>
  );
};

export default UpdateRestaurant;
