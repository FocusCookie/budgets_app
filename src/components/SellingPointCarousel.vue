<template>
  <div class="d-flex justify-space-between align-center">
    <v-btn color="primary elevation-0" fab dark small @click="prev">
      <v-icon>mdi-chevron-left</v-icon>
    </v-btn>

    <div
      class="selection mx-2 rounded-lg d-flex justify-space-between align-center text-center px-2"
      @click="dialog = !dialog"
    >
      <transition name="slide-fade" mode="out-in">
        <v-icon :key="sellingPointIcon" color="primary">
          {{ sellingPointsToSelect[selectIndex].category.icon }}
        </v-icon>
      </transition>

      <transition name="slide-fade" mode="out-in">
        <div :key="sellingPointName" style="width:100%;">
          <span class="font-weight-bold text-uppercase custom-line-height">{{
            sellingPointsToSelect[selectIndex].name
          }}</span>
        </div>
      </transition>
    </div>

    <v-btn color="primary elevation-0" fab dark small @click="next">
      <v-icon>mdi-chevron-right</v-icon>
    </v-btn>

    <v-dialog v-model="dialog" scrollable max-width="400px">
      <v-card>
        <v-list dense>
          <v-list-item-group color="primary">
            <v-list-item
              v-for="(sp, i) in sellingPointsToSelect"
              :key="i"
              @click="selectSellingPoint(i)"
            >
              <v-list-item-icon>
                <v-icon v-text="sp.category.icon" />
              </v-list-item-icon>
              <v-list-item-content
                class="text-left text-button font-weight-bold"
              >
                <v-list-item-title v-text="sp.name" />
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "SellingPointCarousel",
  data: () => ({
    sellingPointIcon: "mdi-at",
    sellingPointName: "name",
    selectIndex: 0,
    selectedSellingPointDropdown: "",
    dialog: false,
  }),
  computed: {
    sellingPointsToSelect() {
      const categories = this.$store.getters["categories/all"];
      const sellingPoints = this.$store.getters["sellingPoints/all"];

      if (sellingPoints.length > 0) {
        return sellingPoints.map(sp => {
          return {
            name: sp.name,
            category: {
              name: sp.category,
              icon: categories.find(cat => cat.title === sp.category).icon,
            },
          };
        });
      } else {
        return [this.newSellingPointCreationText];
      }
    },
  },
  created() {
    this.$emit(
      "selected",
      this.$store.getters["sellingPoints/all"].find(
        sp => sp.name === this.sellingPointsToSelect[this.selectIndex].name,
      ),
    );

    console.log(this.sellingPointsToSelect);
  },
  methods: {
    prev() {
      if (this.selectIndex <= 0) {
        this.selectIndex = this.sellingPointsToSelect.length - 1;
      } else {
        this.selectIndex--;
      }

      this.$emit(
        "selected",
        this.$store.getters["sellingPoints/all"].find(
          sp => sp.name === this.sellingPointsToSelect[this.selectIndex].name,
        ),
      );
    },
    next() {
      if (this.selectIndex >= this.sellingPointsToSelect.length - 1) {
        this.selectIndex = 0;
      } else {
        this.selectIndex++;
      }

      this.$emit(
        "selected",
        this.$store.getters["sellingPoints/all"].find(
          sp => sp.name === this.sellingPointsToSelect[this.selectIndex].name,
        ),
      );
    },
    selectSellingPoint(index) {
      this.selectIndex = index;

      this.$emit(
        "selected",
        this.$store.getters["sellingPoints/all"].find(
          sp => sp.name === this.sellingPointsToSelect[this.selectIndex].name,
        ),
      );
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
