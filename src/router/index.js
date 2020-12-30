import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Analytics from "../views/Analytics.vue";
import History from "../views/History.vue";
import Settings from "../views/Settings.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/home",
    name: "Home",
    component: Home,
  },
  {
    path: "/analytics",
    name: "Analytics",
    component: Analytics,
  },
  {
    path: "/history",
    name: "History",
    component: History,
  },
  {
    path: "/settings",
    name: "Settings",
    component: Settings,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
