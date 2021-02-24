<template>
  <div class="d-flex justify-space-between align-center">
    <v-btn color="primary elevation-0" fab dark small @click="add">
      <v-icon>mdi-chevron-left</v-icon>
    </v-btn>

    <div
      class="selection mx-2 rounded-lg d-flex justify-space-between align-center text-center px-2"
    >
      <transition name="slide-fade" mode="out-in">
        <v-icon :key="sellingPointIcon" color="primary">
          {{ sellingPointIcon }}
        </v-icon>
      </transition>

      <transition name="slide-fade" mode="out-in">
        <div :key="sellingPointName" style="width:100%;">
          <span class="font-weight-bold text-uppercase custom-line-height">{{
            sellingPointName
          }}</span>
        </div>
      </transition>
    </div>

    <v-btn color="primary elevation-0" fab dark small @click="subtract">
      <v-icon>mdi-chevron-right</v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
  name: "SellingPointCarousel",
  data: () => ({
    sellingPointIcon: "mdi-at",
    sellingPointName: "name",
  }),
  methods: {
    add() {
      this.sellingPointName = "Ein sehr sehr langer name für Laden";
      this.sellingPointIcon = "mdi-wifi";
    },
    subtract() {
      this.sellingPointName = "name";
      this.sellingPointIcon = "mdi-at";
    },
  },
};
</script>
<style scoped>
.selection {
  border: 2px solid var(--v-primary-base);
  min-height: 40px;
  width: 100%;
}

.custom-line-height {
  line-height: 0px;
}

.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transform: translateY(10px);
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for <2.1.8 */ {
  transform: translateY(-10px);
  opacity: 0;
}
</style>
