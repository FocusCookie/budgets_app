<template>
  <div id="container">
    <div :class="`budgetLeftContainer ${budgetContainerSize}`">
      <span class="text-overline white--text ma-0">Budget Left</span>
      <p
        :class="
          `font-weight-bold white--text mb-0 ${
            budgetContainerSize === 'minified' ? 'text-h4' : 'text-h1'
          }`
        "
      >
        10000
      </p>
    </div>
    <div
      :class="
        `expensesContainer ${
          budgetContainerSize === 'expanded'
            ? 'expensesPaddingTopWhenBugetLeftExpanded'
            : 'expensesPaddingTopWhenBugetLeftMinified'
        }`
      "
    >
      <div class="py-2">
        expenses cards
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "Home",
  components: {},
  data() {
    return {
      scrolledFromTop: 0,
      budgetContainerSize: "expanded",
    };
  },
  created() {
    // add event listener for scrolling
    window.addEventListener("scroll", this.handleScroll);
  },
  destroyed() {
    // remove eventlisterner on scroll
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    handleScroll(e) {
      if (e.path[1].scrollY >= 10) {
        this.budgetContainerSize = "minified";
      } else {
        this.budgetContainerSize = "expanded";
      }
    },
  },
};
</script>

<style scoped>
#container {
  height: 100%;
}
.budgetLeftContainer {
  background: linear-gradient(123.87deg, #00ba88 0%, #d0e586 100%);
  width: 100%;
  position: fixed;
  top: 0;
  transition-timing-function: ease-in-out;
  transition: height 1s, padding 500ms;
}

.expanded {
  height: 160px;
  padding: 15px 0;
}

.minified {
  height: 84px;
  padding: 6px 0;
}

.expensesPaddingTopWhenBugetLeftExpanded {
  padding-top: 160px;
}

.expensesPaddingTopWhenBugetLeftMinified {
  padding-top: 84px;
}

.expensesContainer {
  background: #eff0f6;
  height: 100%;
}

.text-h4 {
  transition-timing-function: ease-in-out;
  transition: font-size 1s, line-height 1s, letter-spacing 1s;
}

.text-h1 {
  transition-timing-function: ease-in-out;
  transition: font-size 1s, line-height 1s, letter-spacing 1s;
}
</style>
