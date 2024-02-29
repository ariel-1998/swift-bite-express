import React from "react";
import { useSearchParams } from "react-router-dom";
import UpdateRestaurantAddress from "./UpdateRestaurantAddress";
import UpdateRestaurantLogo from "./UpdateRestaurantLogo";
import UpdateRestaurantImage from "./UpdateRestaurantImage";
import UpdateRestaurantName from "./UpdateRestaurantName";
import AddRestaurantAddress from "./AddRestaurantAddress";
import { NestedRestaurantAndAddress } from "../../../../models/Restaurant";
import AddCategory from "../../../CategoryArea/AddCategory";
import CategoryForm from "../../../CategoryArea/CategoryForm";

type FormNames = "name" | "logo" | "image" | "address" | "category";
export type UpdateRestaurantLocationState = { activeForm?: FormNames };
const searchParam = "activeForm";

type UpdateRestaurantProps = {
  data: NestedRestaurantAndAddress;
};

const UpdateRestaurant: React.FC<UpdateRestaurantProps> = ({ data }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeForm = (searchParams.get(searchParam) as FormNames) || "name";

  const setActiveForm = (formName: FormNames) => {
    setSearchParams((prev) => {
      prev.set(searchParam, formName);
      return prev;
    });
  };

  return (
    <>
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
            onClick={() => setActiveForm("image")}
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
          <li
            onClick={() => setActiveForm("category")}
            className="cursor-pointer grow hover:bg-secondary p-2 transition-colors text-center"
          >
            Category
          </li>
        </ul>

        <h1 className="text-center font-bold text-2xl ">Update {activeForm}</h1>

        {activeForm === "image" && <UpdateRestaurantImage restaurant={data} />}

        {activeForm === "logo" && <UpdateRestaurantLogo restaurant={data} />}

        {activeForm === "address" &&
          (data.address.id ? (
            <UpdateRestaurantAddress restaurant={data} />
          ) : (
            <AddRestaurantAddress restaurant={data} />
          ))}

        {activeForm === "name" && <UpdateRestaurantName restaurant={data} />}
        {activeForm === "category" && <CategoryForm restaurantId={data.id} />}
        {/* {activeForm === "image" ? (
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
        )} */}
      </div>
    </>
  );
};

export default UpdateRestaurant;