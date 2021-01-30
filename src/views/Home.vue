<template>
  <div id="homeContainer" class="py-1">
    <div id="expensesContainer">
      <div :class="typeToShow !== 'monthly' ? 'slide' : 'slide toMonthly'">
        <div
          :class="typeToShow !== 'monthly' ? 'list px-3' : 'list px-3 fadeOut'"
        >
          <transition-group name="list" tag="div">
            >
            <Expenses
              v-for="expense in spontaneousExpenses"
              :key="`${expense.name}-${expense.dateCreated}`"
              :expense="expense"
              class="list-item"
              @edit="startEditingExpense(expense)"
            />
          </transition-group>
        </div>
        <div class="list px-3">
          <transition-group name="list" tag="div">
            >
            <Expenses
              v-for="expense in monthlyExpenses"
              :key="`${expense.name}-${expense.dateCreated}`"
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
      :selling-points="sellingPoints"
      :selling-point-categories="sellingPointCategories"
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
      expenses: null,
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
      sellingPoints: [
        //TODO: needs to be fetched via api
        "Rewe",
        "Lidl",
        "Edeka",
        "Amazon",
        "OBI",
        "Starbucks",
        "Dönerladen",
        "Lieferando",
      ],
      sellingPointCategories: ["Food", "Drinks", "Streaming"], //TODO:  needs be fetched via api
      selectedExpenseToEdit: null,
    };
  },
  computed: {
    monthlyExpenses() {
      return this.expenses.filter(expense => expense.type === "monthly");
    },
    spontaneousExpenses() {
      return this.expenses.filter(expense => expense.type === "spontaneous");
    },
  },
  created() {
    // only for dev, delete after dev
    if (!this.expenses) this.expenses = this.devExpenses;

    this.nextNum = this.expenses.length;
  },
  methods: {
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
    createdExpense(v) {
      this.createDialog = false;
      console.log("CREATED ", v);
    },
    cancelCreatingExpense() {
      this.createDialog = false;
      console.log("CANCELED CRATE EXPENSE");
    },
    editedExpense(v) {
      this.editDialog = false;
      console.log("EDITED ", v);
    },
    cancelEditingExpense() {
      this.editDialog = false;
      console.log("CANCELED EDIT EXPENSE");
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
