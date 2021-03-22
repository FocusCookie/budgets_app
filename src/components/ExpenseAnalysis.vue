<template>
  <div>
    Expense Analysis
    <br />
    {{ expense }}
  </div>
</template>

<script>
export default {
  name: "ExpenseAnalysis",
  props: {
    expense: {
      type: Object,
      require: true,
    },
  },
  data: () => ({}),
  methods: {},
};
</script>
