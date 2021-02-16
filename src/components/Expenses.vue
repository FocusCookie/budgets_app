<template>
  <div class="expenseWrapper">
    <span class="secondary--text font-weight-bold text--lighten-2 caption"
      >{{ dateCreated }}
    </span>
    <div
      id="expensesContainer"
      :class="`pa-3 my-2 mt-1 ${expand ? 'expanded' : 'minified'}`"
    >
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

      <div v-if="expand" class="sellingPointCategoryAndName text-left">
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

      <div
        :class="
          `expenseSum font-weight-bold  pink--text text--lighten-1 ${
            expand ? 'text-center text-h2' : 'text-right text-h4'
          }`
        "
      >
        {{ expenseToDisplay.sum }} €
      </div>

      <div class="moreBtn text-center">
        <v-btn
          outlined
          dark
          fab
          x-small
          color="secondary lighten-1"
          @click="expand = !expand"
        >
          <v-icon small color="primary">
            {{ expand ? "mdi-close" : "mdi-dots-horizontal" }}
          </v-icon>
        </v-btn>
      </div>

      <div v-if="expand" class="editBtn text-center">
        <v-btn
          outlined
          dark
          fab
          x-small
          color="secondary lighten-1"
          @click="showExpenseEditDialog = !showExpenseEditDialog"
        >
          <v-icon small color="primary">
            mdi-pen
          </v-icon>
        </v-btn>
      </div>

      <EditExpenseDialog
        :display="showExpenseEditDialog"
        :expense="expenseToDisplay"
        :selling-point="sellingPoint"
        @saved="expenseWasEdited"
        @canceled="closeEditExpenseDialog"
        @deleted="expenseDeleted"
      />
    </div>
  </div>
</template>

<script>
import EditExpenseDialog from "@/components/EditExpenseDialog.vue";
import moment from "moment";

export default {
  name: "Expenses",
  components: { EditExpenseDialog },
  props: ["expense"],
  data() {
    return {
      showExpenseEditDialog: false,
      expenseToDisplay: {},
      expand: false,
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

    dateCreated() {
      return moment(this.expenseToDisplay.dateCreated).format(
        "DD. MMM - hh:mm",
      );
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
    expenseDeleted() {
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

.expenseWrapper {
  width: 100%;
}

#expensesContainer {
  background: #fcfcfc;
  border-radius: 14px;
  display: grid;
  width: 100%;
  column-gap: 10px;
  row-gap: 10px;
  width: 100%;
}
.minified {
  grid-template-rows: auto;
  grid-template-columns: 40px 24px 4fr 40px;
  grid-template-areas: "sellingPointInitials sellingPointIcon expenseSum moreBtn";
}
.expanded {
  grid-template-rows: 40px auto;
  grid-template-columns: 40px 24px 4fr 40px 40px;
  grid-template-areas:
    "sellingPointInitials sellingPointIcon sellingPointCategoryAndName edit moreBtn"
    "expenseSum expenseSum expenseSum expenseSum expenseSum";
}

.expenseSum {
  grid-area: expenseSum;
}

.editBtn {
  grid-area: edit;
  align-self: center;
}

.dateCreaded {
  grid-area: dateCreaded;
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
  width: 40px;
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
