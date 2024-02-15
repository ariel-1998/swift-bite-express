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
  //need to implement in restaurant page
  async getSingleRestaurantById(
    restaurantId: number
  ): Promise<NestedRestaurantAndAddress> {
    const { data } = await defaultAxios.get(
      `${restaurantRoute}/${restaurantId}`
    );
    return data;
  }
  //need to implement search
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
    formData.append("image", image[0]);
    formData.append("logoImage", logoImage[0]);
    const { data } = await credentialsAxios.post<NestedRestaurantAndAddress>(
      restaurantRoute,
      formData
    );
    return data;
  }

  async updateRestaurant({
    restaurantId,
    image,
    logoImage,
    name,
  }: UpdateRestaurant): Promise<NestedRestaurantAndAddress> {
    const formData = new FormData();
    if (image) formData.append("image", image[0]);
    if (logoImage) formData.append("image", logoImage[0]);

    const params: UpdateRestaurantQueryParams = {
      image: Boolean(image),
      logoImage: Boolean(logoImage),
      name: name,
    };
    const { data } = await credentialsAxios.put(
      `${restaurantRoute}/${restaurantId}`,
      {},
      { params }
    );
    return data;
  }

  // async removeRestaurant(id: number): Promise<void> {}
}
export const restaurantService = new RestaurantService();
