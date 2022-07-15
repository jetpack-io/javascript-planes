<template>
  <div id="main">
    <div id="header">
      <SiteHeader />
    </div>
    <div id="top-row">
      <SelectedFlight />
      <FlightLoader />
    </div>
    <FlightMap />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SiteHeader from './components/SiteHeader.vue';
import SelectedFlight from './components/SelectedFlight.vue';
import FlightMap from './components/FlightMap.vue';
import FlightLoader from './components/FlightLoader.vue';

export default defineComponent({
  name: 'App',

  components: {
    SiteHeader,
    SelectedFlight,
    FlightMap,
    FlightLoader
  }
});
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  width: 100vw;
  height: 100vh;
}
#app {
  font-family: 'Raleway', sans-serif;
  font-weight: 400;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100vw;
  height: 100vh;
}
#main {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
}
#main > * {
  width: 100%;
}
#header {
  /*
  background-color: #280459;
  color: white;
  */
  background-color: #F8F4EA;
  color: black;
}
#top-row {
  display: flex;
  flex-direction: row;
  background-color: #F8F4EA;
  color: black;
}
@media (max-width: 970px) {
  #top-row {
    flex-direction: column;
  }
}
#top-row > * {
  padding: 0 15px 0 15px;
  margin: 0;
}
h2 {
  font-size: 15pt;
  display: inline-block;
  padding-right: 0.5em;
}
</style>
