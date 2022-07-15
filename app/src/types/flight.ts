// docs: https://opensky-network.org/apidoc/rest.html
export interface Flight {
  loadDate: string; //DateTime;
  ica024: string;
  callsign?: string;
  originCountry: string;
  timePosition?: string; //DateTime;
  lastContact: string; //DateTime;
  longitude?: number;
  latitude?: number;
  baroAltitude?: number;
  onGround: boolean;
  velocity?: number;
  trueTrack?: number; // clockwise rotation degrees from north
  verticalRate?: number;
  //sensors?: number[];
  altitude?: number;
  squawk?: string;
  spi: boolean;
  positionSource: number; // 0 = ADS-B, 1 = ASTERIX, 2 = MLAT
}
