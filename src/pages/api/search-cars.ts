import { NextApiRequest, NextApiResponse } from 'next';
import { SearchParams } from '@/models/SearchParams';
import { getMockCars } from '@/services/mockData';

// API Mock para búsqueda de vehículos y la consume el cliente

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ cars: any[] }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ cars: [] });
  }

  const { city, pickupDate, dropoffDate } = req.query;

  // Validación básica de parámetros
  if (!city || !pickupDate || !dropoffDate) {
    return res.status(400).json({ cars: [] });
  }

  const searchParams: SearchParams = {
    city: city as string,
    pickupDate: pickupDate as string,
    dropoffDate: dropoffDate as string,
  };

  const cars = getMockCars(searchParams);

  res.status(200).json({ cars });
}
