module.exports = {
  env: {
    node: true,
    commonjs: true,
    browser: true,
    es6: true,
    "jest/globals": true,
  },
  extends: [
    "plugin:prettier/recommended",
    // add more generic rulesets here, such as:
    "eslint:recommended",
    "plugin:jest/recommended",
    //"plugin:vue/vue3-recommended",
    "plugin:vue/recommended", // Use this if you are using Vue.js 2.x.
  ],
  rules: {
    quotes: [2, "double", { avoidEscape: true }],
    // override/add rules settings here, such as:
    "vue/no-unused-vars": "error",
    // prettier
    "prettier/prettier": ["error"],
    "vue/html-self-closing": [
      "error",
      {
        html: {
          void: "any",
        },
      },
    ],
  },
};
