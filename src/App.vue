<template>
  <v-app light>
    <v-container v-if="!loggedIn">
      <Login />
    </v-container>

    <div v-if="loggedIn">
      <div id="vault" class="text-center">
        <span class="text-overline primary--text">Tresorname</span>
      </div>

      <div id="content">
        <!-- use a dynamic transition name -->
        <transition name="router-view-fade" mode="out-in">
          <router-view />
        </transition>
      </div>

      <div id="nav">
        <BottomNavBar />
      </div>
    </div>
  </v-app>
</template>

<script>
import BottomNavBar from "./components/BottomNavBar";
import Login from "./components/Login.vue";

export default {
  name: "Budgets",
  components: { BottomNavBar, Login },
  props: {},
  computed: {
    loggedIn() {
      return this.$store.getters["auth/loggedIn"];
    },
  },
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
  padding-top: 40px;
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

.router-view-fade-enter-active,
.router-view-fade-leave-active {
  transition: opacity 200ms ease-in;
}
.router-view-fade-enter, .router-view-fade-leave-to
/* .component-fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
