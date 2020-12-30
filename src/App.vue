<template>
  <v-app light>
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
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#content {
  height: 100%;
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
}
</style>
