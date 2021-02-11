import Vue from "vue";
import VueRouter from "vue-router";
import Analytics from "../views/Analytics.vue";
import History from "../views/History.vue";
import Login from "../views/Login.vue";
import Home from "../views/Home.vue";
import Settings from "../views/Settings.vue";
import { store } from "@/services/store.service.js";

Vue.use(VueRouter);

const routes = [
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: {
      public: true, // Allow access to even if not logged in
      onlyWhenLoggedOut: true,
    },
  },
  {
    path: "/",
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
    path: "/home",
    name: "Home",
    component: Home,
  },
  {
    path: "/settings",
    name: "Settings",
    component: Settings,
  },
  {
    // DEFAULT Fallback
    path: "*",
    component: Home,
  },
];

const router = new VueRouter({
  mode: "history",
  routes,
});

router.beforeEach((to, from, next) => {
  const isPublic = to.matched.some(record => record.meta.public);
  const onlyWhenLoggedOut = to.matched.some(
    record => record.meta.onlyWhenLoggedOut,
  );
  const loggedIn = store.getters["auth/loggedIn"];

  if (!isPublic && !loggedIn) {
    return next({
      path: "/login",
      query: { redirect: to.fullPath }, // Store the full path to redirect the user to after login
    });
  }

  // Do not allow user to visit login page if they are logged in
  if (loggedIn && onlyWhenLoggedOut) {
    return next("/");
  }

  next();
});

export default router;
