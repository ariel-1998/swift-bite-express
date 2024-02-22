export type Extra = {
  id: number;
  menuItemId: number; //refers to MenuItem
  restaurantId: number; //refres to restaurant
  name: string;
  extraPrice: number | undefined | null;
  type: "drink" | "extra";
};
