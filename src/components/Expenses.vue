<template>
  <div id="expensesContainer" class="pa-3 my-3 ">
    <v-card
      class="sellingPointInitials"
      elevation="0"
      :color="`${sellingPoint.color}`"
    >
      <span class="text-uppercase white--text font-weight-black">{{
        sellingPoint.initials
      }}</span>
    </v-card>

    <div class="sellingPointIcon">
      <v-icon>
        {{ icon }}
      </v-icon>
    </div>

    <div class="sellingPointCategoryAndName text-left">
      <span
        class="sellingPointCategory text-overline pa-0 mb-0  font-weight-bold secondary--text text--lighten-2"
        >{{ sellingPoint.category }}
      </span>
      <p
        class="sellingPointName text-body-4 text-uppercase font-weight-bold pa-0 ma-0"
      >
        {{ sellingPoint.name }}
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
        @click="showExpenseEditDialog = !showExpenseEditDialog"
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
      {{ expenseToDisplay.sum }} €
      <br />
      <span class="overline">
        {{ expenseToDisplay.dateCreated.split("T")[0] }}
      </span>
    </div>

    <EditExpenseDialog
      :display="showExpenseEditDialog"
      :expense="expenseToDisplay"
      :selling-point="sellingPoint"
      @saved="expenseWasEdited"
      @canceled="closeEditExpenseDialog"
      @deleted="closeEditExpenseDialog"
    />
  </div>
</template>

<script>
import EditExpenseDialog from "@/components/EditExpenseDialog.vue";

export default {
  name: "Expenses",
  components: { EditExpenseDialog },
  props: ["expense"],
  data() {
    return {
      showExpenseEditDialog: false,
      expenseToDisplay: {},
    };
  },
  computed: {
    sellingPoint() {
      const sellingPoints = this.$store.getters["sellingPoints/all"];
      const sellingPoint = sellingPoints.find(
        sp => sp._id === this.expenseToDisplay.sellingPoint,
      );

      return sellingPoint
        ? sellingPoint
        : {
            name: "",
            category: "",
            color: "",
            initials: "",
            owner: "",
            icon: "",
            _id: "",
          };
    },

    categories() {
      return this.$store.getters["categories/all"];
    },

    icon() {
      // this is necessary because in case of switching the vault the expenses are used from the vault before and throw errors
      // this is not visible for the user, but it happens for once circle in the app
      if (this.sellingPoint.category !== "") {
        return this.categories.find(
          cat => cat.title === this.sellingPoint.category,
        ).icon;
      } else {
        return "mdi-alert";
      }
    },
  },
  created() {
    this.expenseToDisplay = this.expense;
  },
  methods: {
    closeEditExpenseDialog() {
      this.showExpenseEditDialog = false;
    },
    expenseWasEdited(changedExpense) {
      this.expenseToDisplay = changedExpense
        ? changedExpense
        : this.expenseToDisplay;
      this.showExpenseEditDialog = false;
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
