import { SQLBoolean } from "./SQLBoolean";

export type MenuItem = {
  id: number;
  name: string;
  restaurantId: number;
  description?: string | null;
  extrasAmount?: number | null;
  showSouces: SQLBoolean;
  imgPublicId?: string | null;
};
