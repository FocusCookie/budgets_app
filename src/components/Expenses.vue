<template>
  <div class="expenseWrapper">
    <v-card class="rounded-lg px-1">
      <div v-if="!showMenu" class="expenseCard" @click="showMenu = !showMenu">
        <v-icon color="primary">
          {{ categories.find(cat => cat.title === sellingPoint.category).icon }}
        </v-icon>
        <div class="nameAndCat">
          <span class="text-overline font-wight-bold">{{
            sellingPoint.name
          }}</span>

          <span
            class="text-overline secondary--text text--lighten-2 font-wight-bold"
            >{{ sellingPoint.category }}</span
          >
        </div>
        <div class="text-right">
          <span class="text-h4 secondary--text text--darken-4 font-weight-bold"
            >{{
              expenseToDisplay.sum >= 100
                ? expenseToDisplay.sum.toFixed(0)
                : expenseToDisplay.sum.toFixed(2)
            }}
            €</span
          >
        </div>
        <span class="text-overline secondary--text text--lighten-2 ">
          {{ dateCreated }}
        </span>
      </div>

      <div v-if="showMenu" class="menuWrapper pa-4">
        <v-btn
          class="elevation-0"
          color="primary"
          outlined
          fab
          @click="editExpense"
        >
          <v-icon>mdi-pen</v-icon>
        </v-btn>
        <v-btn
          class="elevation-0"
          color="primary"
          fab
          @click="showMenu = !showMenu"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-btn
          class="elevation-0"
          color="error"
          outlined
          fab
          @click="showDeleteDialog = true"
        >
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </div>
    </v-card>

    <DeleteExpense
      v-if="showDeleteDialog"
      :expense="expenseToDisplay"
      @canceled="showDeleteDialog = false"
      @deleted="showDeleteDialog = false"
    />
  </div>
</template>

<script>
import DeleteExpense from "@/components/DeleteExpense.vue";
import moment from "moment";

export default {
  name: "Expenses",
  components: { DeleteExpense },
  props: {
    expense: {
      type: Object,
      require: true,
    },
  },
  data() {
    return {
      expenseToDisplay: {},
      expand: false,
      showMenu: false,
      showDeleteDialog: false,
    };
  },
  computed: {
    sellingPoint() {
      const sellingPoints = this.$store.getters["sellingPoints/all"];
      let sellingPoint = sellingPoints.find(
        sp => sp._id === this.expenseToDisplay.sellingPoint,
      );

      return sellingPoint
        ? sellingPoint
        : {
            name: "",
            category: "",
            owner: "",
            icon: "",
            _id: "",
          };
    },

    dateCreated() {
      return moment(this.expenseToDisplay.dateCreated).format(
        "DD. MMM - HH:mm",
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
  watch: {
    expense: {
      deep: true,
      immediate: true,
      handler(update) {
        this.expenseToDisplay = Object.assign({}, update);
      },
    },
  },
  created() {
    this.expenseToDisplay = this.expense;
  },
  methods: {
    handleExpenseDeletion(e) {
      console.log(e);
    },
    editExpense() {
      this.$emit("edit", true);
    },
    expenseDeleted() {
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
  height: 1fr;
  width: 1fr;
}

.menuWrapper {
  height: 229px;
  width: 1fr;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}

.expenseCard {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 34px 112px 51px 32px;
  align-items: center;
}

.nameAndCat {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-content: flex-start;
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

.expenseSum {
  grid-area: expenseSum;
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
