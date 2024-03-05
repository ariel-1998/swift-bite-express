import { Coordinates } from "../models/Address";
import {
  NestedRestaurantAndAddress,
  Restaurant,
  RestaurantSchema,
} from "../models/Restaurant";
import { credentialsAxios, defaultAxios } from "../utils/axiosConfig";

const restaurantRoute = "/restaurant";

type UpdateRestaurant = {
  restaurantId: number;
  image?: FileList;
  logoImage?: FileList;
  name?: string;
};

type UpdateRestaurantQueryParams = {
  image?: boolean;
  logoImage?: boolean;
  name?: string;
};

class RestaurantService {
  async getSingleRestaurantById(
    restaurantId: number
  ): Promise<NestedRestaurantAndAddress> {
    const { data } = await defaultAxios.get(
      `${restaurantRoute}/${restaurantId}`
    );
    return data;
  }
  async searchRestaurantsByName(
    search: string,
    page: number,
    coordinates: Partial<Coordinates>
  ): Promise<Restaurant[]> {
    const { data } = await defaultAxios.get(
      `${restaurantRoute}/search/${search}`,
      { params: { ...coordinates, page } }
    );
    return data;
  }

  async getNearRestaurantsByPage(
    page: number,
    coordinates: Partial<Coordinates>
  ): Promise<NestedRestaurantAndAddress[]> {
    const { data } = await defaultAxios.get<NestedRestaurantAndAddress[]>(
      restaurantRoute,
      {
        params: { page, ...coordinates },
      }
    );
    return data;
  }

  async createRestaurant({
    image,
    logoImage,
    name,
  }: RestaurantSchema): Promise<NestedRestaurantAndAddress> {
    const formData = new FormData();
    formData.append("name", name);
    if (image) formData.append("image", image[0]);
    if (logoImage) formData.append("logoImage", logoImage[0]);
    const { data } = await credentialsAxios.post<NestedRestaurantAndAddress>(
      restaurantRoute,
      formData
    );
    return data;
  }
  //check
  async updateRestaurant({
    restaurantId,
    image,
    logoImage,
    name,
  }: UpdateRestaurant): Promise<NestedRestaurantAndAddress> {
    const formData = new FormData();
    if (image) formData.append("image", image[0]);
    if (logoImage) formData.append("image", logoImage[0]);

    const params: UpdateRestaurantQueryParams = name
      ? { name }
      : image
      ? { image: true }
      : { logoImage: true };
    const { data } = await credentialsAxios.put(
      `${restaurantRoute}/${restaurantId}`,
      formData,
      { params }
    );
    return data;
  }
  //need to implement
  async getOwnerRestaurants(): Promise<NestedRestaurantAndAddress[]> {
    const route = `${restaurantRoute}/owner`;
    console.log(route);
    const { data } = await credentialsAxios.get(route);
    return data;
  }

  // async removeRestaurant(id: number): Promise<void> {}
}
export const restaurantService = new RestaurantService();
