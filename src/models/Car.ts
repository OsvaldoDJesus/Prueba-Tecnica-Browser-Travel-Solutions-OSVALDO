/**
 * Model carros 
 */
export interface Car {
  id: string;
  name: string;
  pricePerDay: number;
  currency: string;
  available: boolean;
  image?: string;
  category?: string;
  features?: string[];
  location: string; //ciudad
}
