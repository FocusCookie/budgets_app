<template>
  <div id="expensesContainer" class="pa-3 my-3 ">
    <div :class="`sellingPointInitials ${expense.sellingPoint.color}`">
      <span class="text-uppercase white--text font-weight-black">{{
        expense.sellingPoint.initials
      }}</span>
    </div>

    <div class="sellingPointIcon">
      <span class="text-h5">{{ expense.sellingPoint.icon }}</span>
    </div>

    <div class="sellingPointCategoryAndName text-left">
      <span
        class="sellingPointCategory text-overline pa-0 mb-0  font-weight-bold secondary--text text--lighten-2"
        >{{ expense.sellingPoint.category }}
      </span>
      <p
        class="sellingPointName text-body-4 text-uppercase font-weight-bold pa-0 ma-0"
      >
        {{ expense.sellingPoint }}
      </p>
    </div>

    <div class="moreBtn text-center">
      <v-btn
        id="editBtn"
        outlined
        dark
        fab
        x-small
        color="secondary"
        @click="emitEdit"
      >
        <v-icon small dark>
          mdi-pen
        </v-icon>
      </v-btn>
    </div>

    <div
      class="
        expenseSum font-weight-bold text-right text-h2 secondary--text
      "
    >
      {{ expense.sum }} €
    </div>
  </div>
</template>

<script>
export default {
  name: "Expenses",
  props: ["expense"],
  data() {
    return {};
  },
  computed: {},
  created() {},
  methods: {
    emitEdit() {
      this.$emit("edit", this.expense);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
:root {
  --main-minified-item-height: 40px;
}

#expensesContainer {
  background: #fcfcfc;
  border-radius: 14px;
  display: grid;
  grid-template-rows: 40px auto;
  grid-template-columns: 40px 24px 4fr 40px;
  grid-template-areas:
    "sellingPointInitials sellingPointIcon sellingPointCategoryAndName moreBtn"
    "expenseSum expenseSum expenseSum expenseSum";
  width: 100%;
  column-gap: 10px;
  row-gap: 10px;
}

.expenseSum {
  grid-area: expenseSum;
}

.edit {
  grid-area: edit;
}

.moreBtn {
  grid-area: moreBtn;
  align-self: center;
}

.sellingPointInitials {
  align-self: center;
  border-radius: 4px;
  grid-area: sellingPointInitials;
  height: var(--main-minified-item-height);
  line-height: 40px;
  text-align: center;
}

.sellingPointIcon {
  align-self: center;
  grid-area: sellingPointIcon;
  height: var(--main-minified-item-height);
  width: 24px;
}

.sellingPointCategoryAndName {
  align-self: center;
  grid-area: sellingPointCategoryAndName;
}

.receiptsImages {
  grid-area: receiptsImages;
  height: auto;
}

.comments {
  grid-area: comments;
  height: auto;
}

/* Vuetify override */
.v-application .text-button {
  line-height: 20px;
}
.v-application .text-overline {
  line-height: 20px;
}
</style>
