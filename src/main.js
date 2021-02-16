import Vue from "vue";
import { store } from "@/services/store.service.js"; // VUEX
import Vuelidate from "vuelidate";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import "material-design-icons-iconfont/dist/material-design-icons.css";
import vuetify from "./plugins/vuetify";
import "roboto-fontface/css/roboto/roboto-fontface.css";
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/dist/vuetify.min.css";
import { ApiService } from "./services/api.service.js";

Vue.config.productionTip = false;

Vue.use(Vuelidate);

// initialize the base url
ApiService.init("http://0.0.0.0:3000/");

new Vue({
  store,
  router,
  vuetify,
  render: h => h(App),
}).$mount("#app");
