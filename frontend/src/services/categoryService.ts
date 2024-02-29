import { Category } from "../models/Category";
import { credentialsAxios } from "../utils/axiosConfig";

const categoryRoute = "/category";

class CategoryService {
  async getAllCategoriesByRestaurantId(
    restaurantId: number
  ): Promise<Category[]> {
    const { data } = await credentialsAxios.get<Category[]>(
      `${categoryRoute}/restaurant/${restaurantId}`
    );
    return data;
  }

  async getSingleCategoryById(categoryId: number) {
    const { data } = await credentialsAxios.get<Category>(
      `${categoryRoute}/${categoryId}`
    );
    return data;
  }

  async addCategory(category: Omit<Category, "id">): Promise<Category> {
    const { data } = await credentialsAxios.post<Category>(
      categoryRoute,
      category
    );
    return data;
  }

  async updateCategory({
    id,
    name,
    restaurantId,
    description,
  }: Category): Promise<Category> {
    const { data } = await credentialsAxios.put<Category>(
      `${categoryRoute}/${id}`,
      {
        name,
        restaurantId,
        description,
      }
    );
    return data;
  }
}

export const categoryService = new CategoryService();
