import dotenv from 'dotenv';
import { createClient } from 'redis';
import { RedisClient } from './types/redis-client';

export function getRedisUrl(): string {
  // FRAGILE: .env leaked in, so don't read .env files when running in prod
  if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
  }

  const { REDIS_URL } = process.env;
  if (REDIS_URL) {
    return REDIS_URL;
  }

  return 'redis://localhost:6379'; // guess
}

export default async function getRedisClient(url?: string): Promise<RedisClient> {
  if (!url) {
    url = getRedisUrl();
  }
  const redisClient: RedisClient = createClient({
    url
  });
  redisClient.on('error', (err: Error) => console.log('Redis Client Error', {url, err}));
  await redisClient.connect();

  return redisClient;
}
