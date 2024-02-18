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

type FormNames = "Name" | "Logo" | "Image" | "Address";
export type UpdateRestaurantLocationState = { activeForm?: FormNames };
const searchParam = "activeForm";

const UpdateRestaurant: React.FC = () => {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeForm: FormNames = searchParams.get(searchParam) as FormNames;

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
        <div className="p-6 sm:p-10 border-secondary border-2 flex flex-col w-[95vw] sm:w-[500px] gap-4 bg-white">
          <h1 className="text-center font-bold text-xl pb-3">{activeForm}</h1>
          <ul>
            <li onClick={() => setActiveForm("Name")}>Name</li>
            <li onClick={() => setActiveForm("Logo")}>Logo</li>
            <li onClick={() => setActiveForm("Image")}>Image</li>
            <li onClick={() => setActiveForm("Address")}>Address</li>
          </ul>
          {activeForm === "Image" ? (
            <UpdateRestaurantImage restaurant={data} />
          ) : activeForm === "Logo" ? (
            <UpdateRestaurantLogo restaurant={data} />
          ) : activeForm === "Address" ? (
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
