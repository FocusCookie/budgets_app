<template>
  <div id="homeContainer" class="py-1">
    <transition-group name="expenseItem" tag="div" class="pa-4 expensesWrapper">
      >

      <Expenses
        v-for="expense in expenses"
        :key="`${expense._id}-${expense.dateCreated}`"
        :expense="expense"
        class="list-item"
        @edit="startEditingExpense(expense)"
      />
    </transition-group>

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
      toggleNew: true,
      selectedExpenseToEdit: null,
    };
  },
  computed: {
    expenses() {
      return this.$store.getters["expenses/currentMonth"]
        .filter(exp => exp.type === this.typeToShow)
        .reverse();
    },
    monthlyExpenses() {
      const monthly = this.expenses.filter(
        expense => expense.type === "monthly",
      );

      return monthly.length > 0 ? monthly.reverse() : [];
    },
    spontaneousExpenses() {
      const spontaneous = this.expenses.filter(
        expense => expense.type === "spontaneous",
      );
      return spontaneous.length > 0 ? spontaneous.reverse() : [];
    },
    mainVault() {
      return this.$store.getters["user/mainVault"];
    },
    noSpontanExpenses() {
      return this.spontaneousExpenses.length === 0 || !this.spontaneousExpenses;
    },
  },
  async created() {
    await this.$store.dispatch("expenses/currentMonth"); // TODO: Remove when webstream function is build in, should only be releaded if
  },
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

.expensesWrapper {
  height: 100%;
  overflow-x: hidden;
  margin-bottom: 95px;
  width: 100%;

  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 16px;

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

.expenseItem-item {
  display: inline-block;
}
.expenseItem-enter-active {
  transition: all 0.3s;
}

.expenseItem-leave-active,
.expenseItem-leave-to {
  opacity: 0;
  transition: all 0.01s;
}
.expenseItem-enter {
  opacity: 0;
  transform: translateX(300px);
}
</style>
