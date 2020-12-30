<template>
  <div id="container">
    <div :class="`budgetLeftContainer elevation-1 ${budgetContainerSize}`">
      <span
        v-if="budgetContainerSize === 'minified' ? false : true"
        class="text-overline white--text ma-0"
        >Budget Left</span
      >
      <p
        :class="
          `font-weight-bold white--text mb-0 budgetShadow ${
            budgetContainerSize === 'minified' ? 'text-h4' : 'text-h1'
          }`
        "
      >
        + 10000
      </p>
    </div>
    <div
      :class="
        `expensesContainer pb-8 ${
          budgetContainerSize === 'expanded'
            ? 'expensesPaddingTopWhenBugetLeftExpanded'
            : 'expensesPaddingTopWhenBugetLeftMinified'
        }`
      "
    >
      <div class="pa-3">
        <Expenses />
        <Expenses />
        <Expenses />
        <Expenses />
        <Expenses />
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Expenses from "@/components/Expenses";

export default {
  name: "Home",
  components: {
    Expenses,
  },
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
    handleScroll() {
      if (window.scrollY >= 5) {
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
  transition: height 500ms, padding 500ms;
  z-index: 100;
}

.budgetShadow {
  text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.25);
}

.expanded {
  height: 160px;
  padding: 15px 0;
}

.minified {
  height: 55px;
  padding: 6px 0;
}

.expensesPaddingTopWhenBugetLeftExpanded {
  padding-top: 160px;
}

.expensesPaddingTopWhenBugetLeftMinified {
  padding-top: 70px;
}

.expensesContainer {
  background: #eff0f6;
  height: 100%;
}

.text-h4 {
  transition-timing-function: ease-in-out;
  transition: font-size 500ms, line-height 500ms, letter-spacing 500ms;
}

.text-h1 {
  transition-timing-function: ease-in-out;
  transition: font-size 500ms, line-height 500ms, letter-spacing 500ms;
}
</style>
