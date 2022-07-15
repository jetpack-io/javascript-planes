<template>
  <span></span>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState } from 'vuex';

interface LoaderData {
  timer: number | undefined;
}

export default defineComponent({

  data() {
    const data: LoaderData = {
      timer: undefined
    };
    return data;
  },

  mounted() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.timer = setInterval(this.loadFlights.bind(this), 5000); // get new server updates

    if (this.flights.length === 0) {
      this.loadFlights();
    }
  },

  beforeUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = undefined;
    }
  },

  computed: {

    ...mapState(['flights'])

  },

  methods: {

    loadFlights() {
      console.log('loading flights');
      this.$store.dispatch('flightsLoad');
    }

  }

});

</script>
