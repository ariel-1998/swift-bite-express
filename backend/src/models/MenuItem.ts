export type MenuItem = {
  id: number;
  restaurantId: number; //foreign key
  name: string;
  description: string;
  publicId?: string;
};
