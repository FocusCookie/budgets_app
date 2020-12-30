import Vue from "vue";
import Vuetify from "vuetify/lib/framework";
import "@mdi/font/css/materialdesignicons.css";

import colors from "vuetify/lib/util/colors";

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: "mdi", // default - only for display purposes
  },
  theme: {
    themes: {
      light: {
        primary: colors.deepPurple.base, // #673AB7
        secondary: colors.blueGrey.base, // #9E9E9E
        accent: colors.lightBlue.base, // #03A9F4
      },
    },
    options: {
      customProperties: true,
    },
  },
});
