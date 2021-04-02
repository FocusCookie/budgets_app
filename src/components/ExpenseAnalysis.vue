<template>
  <v-card
    class="rounded-lg white elevation-2 d-flex flex-column"
    @click="emitClick"
  >
    <div
      class="pa-3 title font-weight-bold text-left d-flex align-center secondary--text text--darken-3"
    >
      <v-icon color="primary" class="mr-1">
        {{ category.icon }}
      </v-icon>
      <span>{{ category.title }}</span>
    </div>
    <div
      :style="{ background: gradientBackground }"
      class="lighten-1 barsWrapper d-flex flex-row pr-2"
    >
      <v-spacer />
      <span class="button white--text font-weight-black"
        >{{ ratioToDisplay }}
      </span>
    </div>
  </v-card>
</template>

<script>
export default {
  name: "ExpenseAnalysis",
  props: {
    category: {
      type: Object,
      require: true,
    },
    options: {
      type: Object,
      default: function() {
        return { currency: true };
      },
    },
  },
  data: () => ({}),
  computed: {
    ratioToDisplay() {
      return this.options.currency
        ? `${this.category.sum} €`
        : `${this.category.share} %`;
    },

    gradientBackground() {
      return `linear-gradient(
    90deg,
    rgba(95, 46, 234, 1) 0%,
    rgba(102, 59, 229, 1) ${this.category.share}%,
    rgba(156, 157, 191, 1) ${this.category.share}%,
    rgba(160, 163, 189, 1) 100%
  )`;
    },
  },
  methods: {
    emitClick() {
      this.$emit("click", this.category.title);
    },
  },
};
</script>

<style>
.barsWrapper {
  height: 23px;
  border-radius: 0 0 8px 8px;
  background: rgb(95, 46, 234);
  transition: all 300ms ease;
}
.percentageRoundedLeft {
  height: 23px;
  width: 50%;
  border-radius: 0 0 0 8px;
  box-sizing: border-box;
  z-index: 99;
}
.percentageRounded {
  width: 99%;
  border-radius: 0 0 8px 8px;
  box-sizing: border-box;
}
</style>
