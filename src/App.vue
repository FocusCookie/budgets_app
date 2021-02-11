<template>
  <v-app light>
    <div
      v-if="loggedIn"
      id="header"
      :class="fullScreenHeader ? 'full-height' : ''"
    >
      <Header @fullscreen="displayHeaderFullscreen" />
    </div>

    <div id="content">
      <!-- use a dynamic transition name -->
      <transition name="router-view-fade" mode="out-in">
        <router-view />
      </transition>
    </div>

    <div v-if="loggedIn" id="nav">
      <BottomNavBar />
    </div>
  </v-app>
</template>

<script>
import BottomNavBar from "./components/BottomNavBar";
import Header from "./components/Header.vue";

export default {
  name: "Budgets",
  components: { BottomNavBar, Header },
  props: {},
  data() {
    return {
      registered: false,
      name: null,
      fullScreenHeader: false,
    };
  },
  computed: {
    loggedIn() {
      return this.$store.getters["auth/loggedIn"];
    },
  },
  created() {},
  methods: {
    displayHeaderFullscreen(v) {
      this.fullScreenHeader = v;
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

#header {
  background: #fcfcfc;
  border-bottom: 1px solid #d6d8e7;
  display: grid;
  overflow: hidden;
  padding: 0 15px;
  position: fixed;
  min-height: 45px;
  top: 0;
  width: 100%;
  z-index: 100;
}

.full-height {
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
