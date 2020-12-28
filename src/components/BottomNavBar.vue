<template>
  <div id="navbarWrapper">
    <div id="home" class="linkWrapper" @click="setLinkTo('home')">
      <div :class="activeLink === 'home' ? 'borderActive' : 'borderInactive'" />
      <v-icon :color="activeLink === 'home' ? 'primary' : ''">
        mdi-home-outline
      </v-icon>
    </div>

    <div id="analytics" class="linkWrapper" @click="setLinkTo('analytics')">
      <div
        :class="activeLink === 'analytics' ? 'borderActive' : 'borderInactive'"
      />
      <v-icon :color="activeLink === 'analytics' ? 'primary' : ''">
        mdi-chart-arc
      </v-icon>
    </div>

    <div id="history" class="linkWrapper" @click="setLinkTo('history')">
      <div
        :class="activeLink === 'history' ? 'borderActive' : 'borderInactive'"
      />
      <v-icon :color="activeLink === 'history' ? 'primary' : ''">
        mdi-calendar-range
      </v-icon>
    </div>
    <div id="settings" class="linkWrapper " @click="setLinkTo('settings')">
      <div
        :class="activeLink === 'settings' ? 'borderActive' : 'borderInactive'"
      />
      <v-icon
        class="special"
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
    return {
      activeLink: "home",
    };
  },
  created() {
    this.activeLink = this.$route.path.slice(1);
  },
  methods: {
    setLinkTo(route) {
      this.activeLink = route;

      // only push if the route is not already shown
      if (this.$route.path.slice(1) !== route) this.$router.push(route);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#navbarWrapper {
  background: #fcfcfc;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: 44px;
}

.linkWrapper {
  display: grid;
  grid-template-rows: 4px 40px;
  height: 100%;
  width: 100%;
}

.linkWrapper:hover,
.v-icon:hover {
  color: var(--v-secondary-darken4);
}

.link {
  color: #2c3e50;

  justify-self: center;
}

.borderInactive {
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  border-top: 4px solid #fcfcfc;
}

.borderActive {
  transition: border 1s;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  border-top: 4px solid var(--v-primary-base);
}

.special {
  margin-top: -8px;
}

.link.router-link-exact-active {
  color: var(--v-primary-base);
  font-weight: bold;
  text-decoration: none;
}
</style>
