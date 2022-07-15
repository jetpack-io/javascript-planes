import { cron } from 'jetpack-io';
import { DateTime } from 'luxon';
import fetch from 'node-fetch';
import getRedisClient from './db.js';
import { RedisClient } from './types/redis-client';
import { Flight } from './types/flight';
import { OpenSkyResponse, OpenSkyRow } from './types/opensky';


// load every minute (OpenSky api caches to 10 seconds on free accounts)
export const job = cron(
  'javascript-planes',
  '* * * * *',
  loadData
);

export default async function loadData(): Promise<void> {
  let db: RedisClient | undefined;
  try {
    // reconnect to Redis every time
    db = await getRedisClient();

    const data = await getFlightData();

    const loadDate = DateTime.fromSeconds(data.time).toISO();

    const flights = data.states
      .map((d: OpenSkyRow) => pivotData(d, loadDate))
      .filter((f: Flight) => f.callsign || f.latitude || f.longitude);

    await saveToRedis(db, flights);

    console.log(`${loadDate}: loaded plane data`);

  } catch (err) {
    console.log('error loading', {err});
  }
  if (db) {
    await db.quit();
  }
}

export async function getFlightData(): Promise<OpenSkyResponse> {

  // docs: https://opensky-network.org/apidoc/rest.html
  const url = 'https://opensky-network.org/api/states/all';
  const res = await fetch(url, {method: 'GET'});
  const data = await res.json() as OpenSkyResponse;

  return data;
}

export function pivotData(f: OpenSkyRow, loadDate: string): Flight {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const [ica024, callsign, originCountry, timePositionNum, lastContactNum, longitude, latitude, baroAltitude, onGround, velocity, trueTrack, verticalRate, sensors, altitude, squawk, spi, positionSource] = f;
  /* eslint-enable @typescript-eslint/no-unused-vars */
  const lastContact = DateTime.fromSeconds(lastContactNum as number).toISO();
  const timePosition = timePositionNum ? DateTime.fromSeconds(timePositionNum as number).toISO() : undefined;
  const flt: Flight = {loadDate, ica024, callsign: (callsign || '').trim(), originCountry, timePosition, lastContact, longitude, latitude, baroAltitude, onGround, velocity, trueTrack, verticalRate, altitude, squawk, spi, positionSource};
  return flt;
}

async function saveToRedis(redisClient: RedisClient, data: Flight[]): Promise<void> {
  await redisClient.set('planes', JSON.stringify(data));
}
