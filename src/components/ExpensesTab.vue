<template>
  <div id="expensesTabContainer" @click="clickTab">
    <span class="text-overline">{{ options.title }}</span>

    <transition v-if="options.side === 'left'" name="slide-fade-left">
      <div v-if="status" class="dot" />
    </transition>

    <transition v-if="options.side === 'right'" name="slide-fade-right">
      <div v-if="status" class="dot" />
    </transition>
  </div>
</template>

<script>
export default {
  name: "ExpensesTab",
  props: ["options", "status"],
  data() {
    return {};
  },
  computed: {
    dotPosition() {
      return this.status ? "centered" : this.options.side;
    },
  },
  created() {},
  methods: {
    clickTab() {
      this.$emit("click", { side: this.options.side });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#expensesTabContainer {
  align-items: flex-start;
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: 2fr 1fr;
  justify-items: center;
  height: 100%;
  width: 100%;
}
.dot {
  background: var(--v-primary-base);
  border-radius: 4px;
  height: 8px;
  width: 8px;
}

.slide-fade-right-enter-active {
  transition: all 150ms ease-in-out;
  transition-delay: 75ms;
}
.slide-fade-right-leave-active.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-75px);
  transition: all 150ms ease-in-out;
}
.slide-fade-right-enter
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(-75px);
  opacity: 0;
}

.slide-fade-left-enter-active {
  transition: all 150ms ease-in-out;
  transition-delay: 75ms;
}
.slide-fade-left-leave-active,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(75px);
  transition: all 150ms ease-in-out;
}
.slide-fade-left-enter
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(75px);
  opacity: 0;
}
</style>
