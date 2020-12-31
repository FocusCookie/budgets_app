<template>
  <v-app light>
    <div id="vault" class="text-center">
      <span class="text-overline primary--text">Tresorname</span>
    </div>
    <div id="content">
      <router-view />
    </div>
    <div id="nav">
      <BottomNavBar />
    </div>
  </v-app>
</template>

<script>
import BottomNavBar from "./components/BottomNavBar";

export default {
  name: "Budgets",
  components: { BottomNavBar },
  props: {},
};
</script>

<style>
#app {
  background: #eff0f6;
  color: #2c3e50;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

#content {
  height: 100%;
  margin-top: 40px;
  padding-bottom: 40px;
}

#vault {
  background: #fcfcfc;
  border-bottom: 1px solid #d6d8e7;
  display: grid;
  grid-template-rows: 100%;
  grid-template-columns: 100%;
  align-items: center;
  height: 45px;
  overflow: hidden;
  padding: 0 15px;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 100;
}

#nav {
  width: 100%;
  height: 45px;
  overflow: hidden;
  position: fixed;
  bottom: 0;
  background: #fcfcfc;
  border-top: 1px solid #d6d8e7;
  padding: 0 15px;
  z-index: 100;
}
</style>
