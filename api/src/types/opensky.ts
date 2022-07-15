// Docs: https://opensky-network.org/apidoc/rest.html
export interface OpenSkyResponse {
  time: number;
  states: OpenSkyRow[];
}

export type OpenSkyRow = [string, string, string, number, number, number, number, number, boolean, number, number, number, number, number, string, boolean, number];
