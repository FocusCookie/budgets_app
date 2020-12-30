<template>
  <div id="container">
    <div class="sliderWrapper">
      <div :class="`slider ${sliderMovement}`" />
    </div>
    <div class="home link" @click="setLinkTo('home')">
      <v-icon
        id="homeIcon"
        class="my-1"
        :color="activeLink === 'home' ? 'primary' : ''"
      >
        mdi-home-outline
      </v-icon>
    </div>
    <div class="analytics link" @click="setLinkTo('analytics')">
      <v-icon
        id="analyticsIcon"
        class="my-1"
        :color="activeLink === 'analytics' ? 'primary' : ''"
      >
        mdi-chart-arc
      </v-icon>
    </div>
    <div class="history link" @click="setLinkTo('history')">
      <v-icon
        id="historyIcon"
        class="my-1"
        :color="activeLink === 'history' ? 'primary' : ''"
      >
        mdi-calendar
      </v-icon>
    </div>
    <div class="settings link mt-n1" @click="setLinkTo('settings')">
      <v-icon
        id="settingsIcon"
        class="my-1"
        :color="activeLink === 'settings' ? 'primary' : ''"
      >
        mdi-cog-outline
      </v-icon>
    </div>
  </div>
</template>

<script>
export default {
  name: "BottomNavBar",
  props: {},
  data() {
    return {};
  },
  computed: {
    activeLink() {
      return this.$route.path.slice(1);
    },
    sliderMovement() {
      let movement = "";
      switch (this.activeLink) {
        case "home":
          movement = "sliderMoveToHome";
          break;
        case "analytics":
          movement = "sliderMoveToAnalytics";
          break;
        case "history":
          movement = "sliderMoveToHistory";
          break;
        case "settings":
          movement = "sliderMoveToSettings";
          break;
        default:
          movement = "sliderMoveToHome";
          break;
      }
      return movement;
    },
  },
  methods: {
    setLinkTo(route) {
      // only push if the route is not already shown
      if (this.$route.path.slice(1) !== route) this.$router.push(route);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: 4px 1fr;
  grid-template-areas:
    "sliderWrapper sliderWrapper sliderWrapper sliderWrapper"
    "home analytics history settings";
  height: 100%;
  width: 100%;
}

.sliderWrapper {
  grid-area: sliderWrapper;
  height: 4px;
}

.slider {
  background: var(--v-primary-base);
  border-radius: 0 0 4px 4px;
  height: 4px;
  width: 25%;
  transition-timing-function: ease-in-out;
  transition: margin-left 1s;
}

.sliderMoveToHome {
  margin-left: 0;
}

.sliderMoveToAnalytics {
  margin-left: 25%;
}

.sliderMoveToHistory {
  margin-left: 50%;
}

.sliderMoveToSettings {
  margin-left: 75%;
}

.home {
  grid-area: home;
}

.analytics {
  grid-area: analytics;
}

.history {
  grid-area: history;
}

.settings {
  grid-area: settings;
}

.link:hover,
.v-icon:hover {
  color: var(--v-secondary-darken4);
}
</style>
