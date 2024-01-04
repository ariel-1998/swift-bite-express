import { Address } from "./Address";

export type Restaurant = {
  id: number;
  address: Address;
  name: string;
  imgUrl?: string;
};

/**
 * a table for addressId, restaurantId and userId was created
 * for many to many relationship
 */
