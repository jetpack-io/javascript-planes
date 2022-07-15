<template>
  <div id="maps">
    <div id="mapContainer"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet-rotatedmarker';
import { mapState, mapMutations } from 'vuex';
import { Flight } from '../types/flight';
import { LatLng } from '../types/latlng';
import { Marker } from '../types/marker';

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const planeFlySel = L.icon({
  iconUrl: '/img/plane-fly.png',
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});
const planeFly = L.icon({
  iconUrl: '/img/plane-fly-selected.png',
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});
const planeLandSel = L.icon({
  iconUrl: '/img/plane-land.png',
  iconSize: [26, 7],
  iconAnchor: [13, 7]
});
const planeLand = L.icon({
  iconUrl: '/img/plane-land-selected.png',
  iconSize: [26, 7],
  iconAnchor: [13, 7]
});

interface MapData {
  center: LatLng;
  zoom: number;
  map: L.Map | undefined;
  markers: Marker[];
  loading: boolean;
}

export default defineComponent({

  data() {
    const data: MapData = {
      center: { lat: 40.416775, lng: -3.703790 },
      zoom: 6,
      map: undefined, // defined in mounted
      markers: [],
      loading: false
    };
    return data;
  },

  mounted() {
    this.setupLeafletMap();
  },

  computed: {

    ...mapState(['flights', 'selectedMarker'])

  },

  watch: {

    flights(newValue /*, oldValue */) {
      this.renderMarkers(newValue);
    }

  },

  methods: {

    ...mapMutations({ setSelectedMarker: 'selectedMarker' }),

    setupLeafletMap: function () {
      const map: L.Map = L.map('mapContainer');
      this.map = map;
      map.setView(this.center, this.zoom);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Icons: <a href="https://www.vecteezy.com/free-vector/silhouette">Silhouette Vectors by Vecteezy</a>'
      }).addTo(map);

      map.on('zoomend', () => {
        this.renderMarkers(this.flights);
      });
      map.on('moveend', () => {
        this.renderMarkers(this.flights);
      });
    },

    // ASSUME: ica024 is unique to a plane and consistent across time

    async renderMarkers(flights: Flight[]) {

      if (!flights.length) {
        // ASSUME: we're in the middle of switching to a new date
        // leave the old planes in place for now
        return;
      }
      if (!this.map) {
        return;
      }
      const map = this.map as L.Map;

      this.loading = true;
      console.log(`render start: ${flights.length} total planes`);
      await sleep(1); // let UI update before we pound the UI thread

      // add / update flights
      const bounds = this.map.getBounds();
      flights.forEach(f => this.updateMarker(f, map, bounds));

      // remove missing flights
      const markers = this.markers as Marker[];
      const toRemove = markers.filter(m => !flights.find(f => f.ica024 === m.ica024));
      toRemove.forEach(this.removeMarker);

      const selectedMarker: Marker | undefined = this.selectedMarker;
      if (selectedMarker && this.markers.indexOf(selectedMarker) === -1) {
        // the flight list no longer includes the selected marker
        const newMarker = this.markers.find(m => m.ica024 === selectedMarker.ica024 && m.ica024);
        this.setSelectedMarker(newMarker);
      }

      this.loading = false;
      console.log(`render done: ${this.markers.length} planes shown`);
    },

    updateMarker(flight: Flight, map: L.Map, bounds: L.LatLngBounds) {

      const marker: Marker | undefined = this.markers.find(m => m.ica024 === flight.ica024) as Marker;
      const latlng: L.LatLngTuple = [flight.latitude ?? 0, flight.longitude ?? 0];

      const visible = bounds.contains(latlng);
      if (!visible) {
        if (marker) {
          if (marker === this.selectedMarker) {
            this.setSelectedMarker(undefined);
          }
          this.removeMarker(marker);
        }
        return;
      }

      if (marker) {
        // update it

        if (marker.flight !== flight) {

          marker.setLatLng(latlng);
          const icon = flight.onGround ? planeLand : planeFly;
          marker.setIcon(icon);
          const rotationAngle: number = flight.onGround ? 0 : (flight.trueTrack ?? 0);
          marker.setRotationAngle(rotationAngle);
          marker.flight = flight;
          if (marker === this.selectedMarker) {
            const selIcon = marker.flight.onGround ? planeLandSel : planeFlySel;
            marker.setIcon(selIcon);
          }

        }

      } else {
        // create one

        const icon = flight.onGround ? planeLand : planeFly;
        const rotationAngle: number = flight.onGround ? 0 : (flight.trueTrack ?? 0);
        const newMarker: Marker = L.marker(latlng, { icon, rotationAngle, rotationOrigin: 'center center' } as L.MarkerOptions) as Marker;
        newMarker.on('click', () => {
          this.changeSelectedMarker(newMarker);
        });
        newMarker.ica024 = flight.ica024;
        newMarker.flight = flight;
        newMarker.addTo(map);
        this.markers.push(newMarker);
      }

    },

    removeMarker(marker: Marker) {
      const map = this.map as L.Map;
      if (!map) {
        return;
      }
      this.markers = this.markers.filter(m => m !== marker);
      marker.removeFrom(map);
    },

    changeSelectedMarker(marker: Marker | undefined) {
      const oldSelectedMarker: Marker | undefined = this.selectedMarker;
      if (oldSelectedMarker) {
        const regIcon = oldSelectedMarker.flight.onGround ? planeLand : planeFly;
        oldSelectedMarker.setIcon(regIcon);
      }

      if (marker) {
        const selIcon = marker.flight.onGround ? planeLandSel : planeFlySel;
        marker.setIcon(selIcon);
        this.setSelectedMarker(marker);
      }
    }

  }

});
</script>

<style scoped>
#maps, #mapContainer {
  width: 100%;
  height: 100%;
}
#maps {
  position: relative;
}
</style>
