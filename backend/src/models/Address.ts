export type Address = {
  id: number;
  country: string;
  state: string;
  street: string;
  building: number;
  entrance?: string;
  apartment?: number;
  coordinates: string;
  // longitude: string;
  // latitude: string;
};
//no foreign keys
