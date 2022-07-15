import { Flight } from '../types/flight';
import { Marker } from './marker';

export interface StoreState {
  flights: Flight[];
  selectedMarker: Marker | undefined;
}
