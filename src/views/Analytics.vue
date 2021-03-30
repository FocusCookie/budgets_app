<template>
  <div class="pa-4">
    <ExpenseAnalysis :category="test" :options="options" @click="print" />
  </div>
</template>

<script>
import ExpenseAnalysis from "@/components/ExpenseAnalysis";

export default {
  name: "Analytics",
  components: { ExpenseAnalysis },
  data() {
    return {
      test: {
        icon: "mdi-at",
        title: "Food Groceries",
        percentage: 50,
        sum: 2990.82,
      },
      options: { currency: false },
    };
  },
  computed: {
    expenses() {
      return this.$store.getters["expenses/currentMonth"];
    },
  },
  methods: {
    print(e) {
      console.log(e);
    },
  },
};
</script>

<style scoped></style>
