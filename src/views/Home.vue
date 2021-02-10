<template>
  <div id="homeContainer" class="py-1">
    <h1 v-if="newUser">
      Welcome 👋
    </h1>

    <div id="expensesContainer">
      <div :class="typeToShow !== 'monthly' ? 'slide' : 'slide toMonthly'">
        <div
          :class="typeToShow !== 'monthly' ? 'list px-3' : 'list px-3 fadeOut'"
        >
          <transition-group name="list" tag="div">
            >
            <v-card
              v-if="spontaneousExpenses.length === 0"
              key="noteNoSpontan"
              class="pa-4 mt-4 rounded-lg"
              outlined
              rounded
            >
              So far no spontaneous expenses this month!
            </v-card>
            <Expenses
              v-for="expense in spontaneousExpenses"
              :key="`${expense._id}-${expense.dateCreated}`"
              :expense="expense"
              class="list-item"
              @edit="startEditingExpense(expense)"
            />
          </transition-group>
        </div>

        <div class="list px-3">
          <transition-group name="list" tag="div">
            >
            <v-card
              v-if="monthlyExpenses.length === 0"
              key="noteNoMonthly"
              class="pa-4 mt-4 rounded-lg"
              outlined
              rounded
            >
              So far no monthly expenses this month!
            </v-card>
            <Expenses
              v-for="expense in monthlyExpenses"
              :key="`${expense._id}-${expense.dateCreated}`"
              :expense="expense"
              class="list-item"
              @edit="startEditingExpense(expense)"
            />
          </transition-group>
        </div>
      </div>
    </div>
    <div id="expensesMenuBarContainer">
      <ExpensesMenuBar
        @typeChange="toggleExpensesTypeToShow"
        @addExpense="startCreation"
      />
    </div>

    <CreateExpenseDialog
      v-if="createDialog"
      @created="expenseSuccessfullyCreated"
      @cancel="cancelCreatingExpense"
    />
  </div>
</template>

<script>
// @ is an alias to /src
import ExpensesMenuBar from "@/components/ExpensesMenuBar";
import Expenses from "@/components/Expenses";
import CreateExpenseDialog from "@/components/CreateExpenseDialog";

export default {
  name: "Home",
  components: {
    ExpensesMenuBar,
    Expenses,
    CreateExpenseDialog,
  },
  data() {
    return {
      createDialog: false,
      editDialog: false,
      typeToShow: "spontaneous",
      devExpenses: [
        {
          dateCreated: "20:01:52",
          sum: 24.65,
          type: "spontaneous",
          sellingPoint: {
            name: "DEV Alnatura",
            initials: "AN",
            icon: "🛒",
            category: "food groceries",
            color: "primary",
          },
        },
        {
          dateCreated: "20:33:50",
          sum: 14.99,
          type: "monthly",
          sellingPoint: {
            name: "DEV Netflix",
            initials: "NF",
            icon: "📽",
            category: "movie streaming",
            color: "secondary",
          },
        },
        {
          dateCreated: "20:34:52",
          sum: 11.44,
          type: "spontaneous",
          sellingPoint: {
            name: "DEV REWE",
            initials: "RW",
            icon: "🛒",
            category: "food groceries",
            color: "success",
          },
        },
        {
          dateCreated: "20:53:52",
          sum: 14.99,
          type: "monthly",
          sellingPoint: {
            name: "DEV Amazon Prime",
            initials: "AM",
            icon: "📽",
            category: "movie streaming",
            color: "error",
          },
        },
      ],
      toggleNew: true,
      selectedExpenseToEdit: null,
    };
  },
  computed: {
    expenses() {
      const exp = this.$store.getters["expenses/currentMonth"];
      return exp ? exp.reverse() : [];
    },
    monthlyExpenses() {
      return this.expenses.filter(expense => expense.type === "monthly");
    },
    spontaneousExpenses() {
      return this.expenses.filter(expense => expense.type === "spontaneous");
    },
    newUser() {
      return this.$store.getters["user/firstTimeLoggedIn"];
    },
    mainVault() {
      return this.$store.getters["user/mainVault"];
    },
  },
  async created() {},
  methods: {
    expenseSuccessfullyCreated() {
      this.createDialog = false;
    },
    toggleExpensesTypeToShow(type) {
      if (this.typeToShow !== type) this.typeToShow = type;
    },
    startCreation() {
      this.createDialog = true;
    },
    pushExpense() {
      this.createDialog = true;

      this.expenses.unshift({
        dateCreated: new Date(),
        sum: 24 + Math.random(),
        type: this.toggleNew ? "monthly" : "spontaneous",
        sellingPoint: {
          name: "DEV NEW",
          initials: "NW",
          icon: "🛒",
          category: "food groceries",
          color: "primary",
        },
      });
      this.toggleNew = !this.toggleNew;
    },
    createdExpense() {
      this.createDialog = false;
    },
    cancelCreatingExpense() {
      this.createDialog = false;
    },
    editedExpense() {
      this.editDialog = false;
    },
    cancelEditingExpense() {
      this.editDialog = false;
    },
    startEditingExpense(expense) {
      this.editDialog = true;
      this.selectedExpenseToEdit = expense;
    },
  },
};
</script>

<style scoped>
#homeContainer {
  background: #eff0f6;
}

#expensesMenuBarContainer {
  position: fixed;
  bottom: 44px;
  width: 100%;
}

#expensesContainer {
  height: 100%;
  overflow-x: hidden;
  margin-bottom: 95px;
  width: 100%;
}

.slide {
  width: 200%;
  -webkit-transition: all 300ms ease-in-out;
  -moz-transition: all 300ms ease-in-out;
  -o-transition: all 300ms ease-in-out;
  transition: all 300ms ease-in-out;
}

.list {
  width: 50%;
  float: left;
  opacity: 100;
  -webkit-transition: all 300ms ease-in-out;
  -moz-transition: all 300ms ease-in-out;
  -o-transition: all 300ms ease-in-out;
  transition: all 300ms ease-in-out;
}

.fadeOut {
  opacity: 0;
}

.toMonthly {
  transform: translateX(-50%);
}

.list-item {
  display: inline-block;
  margin-right: 10px;
}
.list-enter-active,
.list-leave-active,
.list-leave-to {
  transition: all 1s;
}
.list-enter  /* .list-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateX(300px);
}
</style>
