import { SQLBoolean } from "./SQLBoolean";

export type MenuItem = {
  id: number;
  name: string;
  restaurantId: number; //refers to restaurants
  description: string | undefined | null;
  extrasAmount: number | undefined | null;
  showSouces: SQLBoolean;
  imgPublicId: string | undefined | null;
};
