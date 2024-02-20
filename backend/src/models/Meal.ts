export type Category = {
  id: number;
  name: string;
  description: string | undefined | null;
  restaurantId: number; //refers to restaurants
};
export type Meal = {
  id: number;
  name: string;
  description: string | undefined | null;
  extrasAmount: number | undefined | null;
  showSouces: boolean;
  imgPublicId: string;
};

export type Sauce = {
  id: number;
  restaurantId: number; //refers to restaurants
  name: string;
};

export type Extra = {
  id: number;
  mealId: number; //refers to Meal
  name: string;
  extraPrice: number | undefined | null;
  type: "drink" | "extra";
};

//should add souces
export type MealCategoryTable = {
  mealId: number; //refers to Meal
  categotyId: number; //refers to Category
};
