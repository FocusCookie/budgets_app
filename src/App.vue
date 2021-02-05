<template>
  <v-app light>
    <v-container v-if="!loggedIn">
      <div v-if="registered">
        <p class="title">
          {{ name }} you have been successfully registered 🎉!
        </p>
        <p>You can now login with your email and password.</p>
      </div>
      <Login @ />

      <br />

      <Register @registered="showLoginMsgAfterRegistration" />
    </v-container>

    <div v-if="loggedIn">
      <div id="header" :class="fullScreenHeader ? 'full-height' : ''">
        <Header @fullscreen="displayHeaderFullscreen" />
      </div>

      <div v-if="mainVault" id="content">
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
import Register from "./components/Register.vue";
import Header from "./components/Header.vue";

export default {
  name: "Budgets",
  components: { BottomNavBar, Login, Register, Header },
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
    mainVault() {
      return this.$route.path === "/settings"
        ? true
        : this.$store.getters["user/mainVault"];
    },
  },
  created() {},
  methods: {
    showLoginMsgAfterRegistration(name) {
      this.registered = true;
      this.name = name;
    },
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
