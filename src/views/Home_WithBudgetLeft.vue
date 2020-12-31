<template>
  <div id="homeContainer">
    <div
      :class="`budgetLeftContainer elevation-1 `"
      :style="`height:${budgetContainerHeight}px`"
    >
      <span v-if="showBudgetLeftCaption" class="text-overline white--text ma-0"
        >Budget Left</span
      >
      <p
        :class="
          `font-weight-bold white--text mb-0 budgetShadow ${
            showBudgetLeftCaption ? '' : 'my-3'
          }`
        "
        :style="
          `font-size:${budgetLeftFontSize}px; line-height:${budgetLeftFontSize}px`
        "
      >
        + 10000
      </p>
    </div>
    <div
      class="expensesContainer"
      :style="`margin-top: ${topMarginExpensesContainer}px`"
    >
      <div class="px-3 pt-3 pb-14">
        <Expenses />
        <Expenses />
        <Expenses />
        <Expenses />
        <Expenses />
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
      budgetContainerHeight: 130,
      maxBudgetContainerHeight: 130,
      budgetLeftFontSize: 86,
      maxBudgetLeftFontSize: 86,
      topMarginExpensesContainer: 130,
    };
  },
  computed: {
    showBudgetLeftCaption() {
      return this.budgetContainerHeight <= 70 ? false : true;
    },
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
      this.budgetContainerHeight =
        this.maxBudgetContainerHeight - window.scrollY;

      this.budgetLeftFontSize = this.maxBudgetLeftFontSize - window.scrollY;

      this.topMarginExpensesContainer =
        this.maxBudgetContainerHeight - window.screenY;

      // check if under 50 if so set back to 50 as minimum
      if (this.budgetContainerHeight < 55) this.budgetContainerHeight = 55;

      if (this.budgetContainerHeight > this.maxBudgetContainerHeight)
        this.budgetContainerHeight = this.maxBudgetContainerHeight;

      if (this.topMarginExpensesContainer < 0)
        this.topMarginExpensesContainer = 0;

      if (this.budgetLeftFontSize < 34) this.budgetLeftFontSize = 34;
      if (this.budgetLeftFontSize > this.maxBudgetLeftFontSize)
        this.budgetLeftFontSize = this.maxBudgetLeftFontSize;

      console.log("height ", this.budgetContainerHeight);
      console.log("font ", this.budgetLeftFontSize);

      if (window.scrollY >= 0) {
        this.budgetContainerSize = "minified";
      } else {
        this.budgetContainerSize = "expanded";
      }
    },
  },
};
</script>

<style scoped>
#homeContainer {
  background: #eff0f6;
}

.budgetLeftContainer {
  background: linear-gradient(123.87deg, #00ba88 0%, #d0e586 100%);
  width: 100%;
  position: fixed;
  top: 0;
  z-index: 100;
}

.specialHeight {
  font-size: 5em;
}

.budgetShadow {
  text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.25);
}

.expensesPaddingTopWhenBugetLeftExpanded {
  padding-top: 160px;
}

.expensesPaddingTopWhenBugetLeftMinified {
  padding-top: 70px;
}

.expensesContainer {
  background: #eff0f6;
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
