import { useQuery } from "@tanstack/react-query";
import React, { MouseEvent, useState } from "react";
import { useParams } from "react-router-dom";
import { restaurantService } from "../../../services/restaurantService";
import queryKeys from "../../../utils/queryKeys";

type UpdateRestaurantProps = {
  // Define props here
};
type FormNames = "Name" | "Logo" | "Image" | "Address";
const UpdateRestaurant: React.FC<UpdateRestaurantProps> = ({ props }) => {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const [activeForm, setActiveForm] = useState<FormNames>("Name");

  const { data, isLoading, isError } = useQuery({
    queryKey: queryKeys.restaurants.getSingleRestaurantById(+restaurantId!),
    queryFn: () => restaurantService.getSingleRestaurantById(+restaurantId!),
    enabled: !!restaurantId,
  });

  const setForm = (formName: FormNames) => () => {
    setActiveForm(formName);
  };
  return (
    <>
      {isLoading && "loading..."}
      {isError && "error"}
      {data && (
        <div className="p-6 sm:p-10 border-secondary border-2 flex flex-col w-[95vw] sm:w-[500px] gap-4 bg-white">
          <h1 className="text-center font-bold text-xl pb-3">{activeForm}</h1>
          <ul>
            <li onClick={setForm("Name")}>Name</li>
            <li onClick={setForm("Logo")}>Logo</li>
            <li onClick={setForm("Image")}>Image</li>
            <li onClick={setForm("Address")}>Address</li>
          </ul>
        </div>
      )}
    </>
  );
};

export default UpdateRestaurant;
