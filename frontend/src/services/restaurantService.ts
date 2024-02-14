import { Coordinates } from "../models/Address";
import {
  NestedRestauranAndAddress,
  Restaurant,
  RestaurantSchema,
} from "../models/Restaurant";
import { credentialsAxios, defaultAxios } from "../utils/axiosConfig";

const restaurantRoute = "/restaurant";

type UpdateRestaurantImage = Pick<Restaurant, "id"> & {
  image: FileList;
};

type UpdateRestaurantName = Pick<Restaurant, "id" | "name">;

class RestaurantService {
  //need to implement in restaurant page
  async getSingleRestaurantById(
    restaurantId: number
  ): Promise<NestedRestauranAndAddress> {
    const { data } = await defaultAxios.get(
      `${restaurantRoute}/${restaurantId}`
    );
    return data;
  }
  //need to implement search
  async searchRestaurantsByName(
    search: string,
    coordinates: Partial<Coordinates>
  ): Promise<Restaurant[]> {
    const { data } = await defaultAxios.get(
      `${restaurantRoute}/search/${search}`,
      { params: coordinates }
    );
    return data;
  }
  // if there is no userAddress, then search return the most liked restaurants (in the backend)
  async getNearRestaurantsByPage(
    page: number,
    coordinates: Partial<Coordinates>
  ): Promise<NestedRestauranAndAddress[]> {
    console.log(coordinates);
    console.log(page);
    const { data } = await defaultAxios.get<NestedRestauranAndAddress[]>(
      restaurantRoute,
      {
        params: { page, ...coordinates },
      }
    );
    return data;
  }

  async createRestaurant({
    image,
    name,
  }: RestaurantSchema): Promise<NestedRestauranAndAddress> {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("file", image[0]);
    const { data } = await credentialsAxios.post<NestedRestauranAndAddress>(
      restaurantRoute,
      formData
    );
    return data;
  }

  async updateRestaurantImage(obj: UpdateRestaurantImage) {}
  async updateRestaurantName(obj: UpdateRestaurantName) {}
  async removeRestaurant(id: number): Promise<void> {}
}

export const restaurantService = new RestaurantService();
