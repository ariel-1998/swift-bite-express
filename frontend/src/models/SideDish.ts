export type SideDish = {
  id: number;
  restaurantId: number;
  name: string;
  extraPrice: number | undefined | null;
  type: "drink" | "sideDish";
};
