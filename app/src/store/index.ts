import { ActionContext, createStore } from 'vuex';
import fetcher from '../services/fetcher';
import { Flight } from '../types/flight';
import { StoreState } from '../types/store';
import { Marker } from '../types/marker';

const defaultState: StoreState = {
  flights: [],
  selectedMarker: undefined
};

export default createStore({
  state: defaultState,

  actions: {

    async flightsLoad(context: ActionContext<StoreState, StoreState>): Promise<Flight[]> {
      const res = await fetcher<Flight[]>('GET', '/api/flight');
      const flights = res.data ?? [];
      context.commit('flights', { flights });
      return flights;
    }

  },

  mutations: {

    flights: (state: StoreState, { flights }: {flights: Flight[]}) => {
      state.flights = flights || [];
    },

    selectedMarker(state: StoreState, marker: Marker | undefined) {
      console.log('selectedMarker', marker);
      state.selectedMarker = marker;
    }

  }

  /*
  getters: {

  }
  */

});
