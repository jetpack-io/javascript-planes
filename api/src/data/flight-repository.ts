import { RedisClient } from '../types/redis-client';
import { Flight } from '../types/flight';

export async function getFlights(db: RedisClient): Promise<Flight[]> {
  const data = await db.get('planes');
  if (!data) {
    return [];
  }
  const planes = JSON.parse(data) as Flight[];
  return planes;
}
