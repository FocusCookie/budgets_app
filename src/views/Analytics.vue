<template>
  <div>
    <div class="pa-4">
      <ExpenseAnalysis
        v-for="cat in anylizedCategories"
        :key="cat.title"
        class="mb-4"
        :category="cat"
        :options="options"
        @click="selectCategoryToDrillDown(cat.title)"
      />
    </div>
    <div id="menuBarContainer">
      <AnalyticsMenuBar
        :options="menuBarOptions"
        @typeChange="options.currency = !options.currency"
        @back="selectedCategoryDrillDown = ''"
      />
    </div>
  </div>
</template>

<script>
import ExpenseAnalysis from "@/components/ExpenseAnalysis";
import AnalyticsMenuBar from "@/components/AnalyticsMenuBar";

export default {
  name: "Analytics",
  components: { ExpenseAnalysis, AnalyticsMenuBar },
  data() {
    return {
      selectedCategoryDrillDown: "",
      options: { currency: false },
    };
  },
  computed: {
    anylizedCategories() {
      if (this.selectedCategoryDrillDown !== "")
        return this.sellingPointsByCategoryWithSumsAndShares(
          this.selectedCategoryDrillDown,
        );
      return this.categoriesSumsAndShares();
    },
    menuBarOptions() {
      return {
        iconColor:
          this.selectedCategoryDrillDown === "" ? "secondary" : "primary",
      };
    },
  },
  created() {},
  methods: {
    sellingPointsSumsAndShares() {
      const currentMonthExpenses = this.$store.getters["expenses/currentMonth"];
      const vaultSellingPoints = [...this.$store.getters["sellingPoints/all"]];
      const totalExpensesSum = currentMonthExpenses.reduce((acc, exp) => {
        acc += exp.sum;
        return acc;
      }, 0);

      const sellingPointsWithTotalSumsAndShare = vaultSellingPoints.map(sp => {
        const copy = { ...sp };
        copy.sum = currentMonthExpenses.reduce((acc, exp) => {
          if (exp.sellingPoint === copy._id) acc += exp.sum;
          return acc;
        }, 0);

        copy.share = ((copy.sum / totalExpensesSum) * 100).toFixed(0);

        return copy;
      });

      return sellingPointsWithTotalSumsAndShare.sort((a, b) => b.sum - a.sum);
    },

    categoriesSumsAndShares() {
      const currentMonthExpenses = this.$store.getters["expenses/currentMonth"];
      const totalExpensesSum = currentMonthExpenses.reduce((acc, exp) => {
        acc += exp.sum;
        return acc;
      }, 0);

      const sellingPointsSumsAndShares = this.sellingPointsSumsAndShares();
      const categories = this.$store.getters["categories/all"];

      const usedCategories = [];

      sellingPointsSumsAndShares.forEach(sp => {
        const categoryIndex = categories.findIndex(
          cat => cat.title === sp.category,
        );

        const catWithSum = { ...categories[categoryIndex], sum: 0 };

        const catAlreadySet = usedCategories.some(
          cat => cat.title === sp.category,
        );

        const spOccuredInExpenses = currentMonthExpenses.some(
          exp => exp.sellingPoint === sp._id,
        );

        if (!catAlreadySet && spOccuredInExpenses)
          usedCategories.push(catWithSum);
      });

      console.log("UC ", usedCategories);

      sellingPointsSumsAndShares.forEach(sp => {
        const usedCatIndex = usedCategories.findIndex(
          cat => cat.title === sp.category,
        );
        const spOccuredInExpenses = currentMonthExpenses.some(
          exp => exp.sellingPoint === sp._id,
        );
        if (spOccuredInExpenses) usedCategories[usedCatIndex].sum += sp.sum;
      });

      const usedCategoriesWithSumAndShare = usedCategories.map(el => {
        const category = { ...el };
        category.share = ((category.sum / totalExpensesSum) * 100).toFixed(0);

        return category;
      });

      return usedCategoriesWithSumAndShare.sort((a, b) => b.sum - a.sum);
    },

    sellingPointsByCategoryWithSumsAndShares(category) {
      const categories = this.$store.getters["categories/all"];

      const sellingPointsSums = this.sellingPointsSumsAndShares().filter(
        sp => sp.category === category,
      );
      const totalCategorySum = sellingPointsSums.reduce(
        (acc, sp) => (acc = acc + sp.sum),
        0,
      );

      const sellingPointsSumsAndShares = sellingPointsSums.map(sp => {
        let copy = { ...sp };
        const category = categories.find(cat => cat.title === copy.category);

        copy.title = copy.name;
        copy.icon = category.icon;
        delete copy.name;

        copy.share = ((copy.sum / totalCategorySum) * 100).toFixed(0);
        return copy;
      });

      return sellingPointsSumsAndShares.sort((a, b) => b.sum - a.sum);
    },

    selectCategoryToDrillDown(cat) {
      if (
        !this.selectedCategoryDrillDown ||
        this.selectedCategoryDrillDown === ""
      )
        this.selectedCategoryDrillDown = cat;
    },
  },
};
</script>

<style scoped>
#menuBarContainer {
  position: fixed;
  bottom: 44px;
  width: 100%;
}
</style>
