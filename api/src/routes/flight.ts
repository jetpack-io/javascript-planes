import { Request, Response } from 'express';
import Router from 'express-promise-router';
import { getFlights } from '../data/flight-repository.js';
import { RedisClient } from '../types/redis-client';

const router = Router();

router.get('/', async function(req: Request, res: Response) {
  const db = req.app.locals.db as RedisClient;
  const flights = await getFlights(db);
  res.json(flights);
});

export default router;
