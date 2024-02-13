import {
  NestedRestauranAndAddress,
  Restaurant,
  RestaurantSchema,
} from "../models/Restaurant";
import { credentialsAxios } from "../utils/axiosConfig";

const restaurantRoute = "/restaurant";

type UpdateRestaurantImage = Pick<Restaurant, "id"> & {
  image: FileList;
};

type UpdateRestaurantName = Pick<Restaurant, "id" | "name">;
class RestaurantService {
  async getSingleRestaurantById(
    restaurantId: number
  ): Promise<NestedRestauranAndAddress> {}
  async searchRestaurantByName(name: string) {}
  // if there is no userAddress, then search return the most liked restaurants (in the backend)
  async getNearRestaurantsByPage(page: number) {}

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
  async removeRestaurant(id: number) {}
}

export const restaurantService = new RestaurantService();
