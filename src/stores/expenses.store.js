import { ExpensesService } from "@/services/expenses.service.js";
import { store } from "@/services/store.service.js";

const state = {
  expensesCurrentMonth: ExpensesService.local.getExpensesCurrentMonth(),
  expensesFromTo: ExpensesService.local.getExpensesFromTo(),
  editingExpenseRequest: false,
  requestingExpensesCurrentMonth: false,
  requestingExpensesFromTo: false,
  creatingExpenseRequest: false,
  deletingExpenseRequest: false,
  expensesError: "",
  expensesErrorStatus: 0,
};

const getters = {
  currentMonth: state => {
    return state.expensesCurrentMonth;
  },
  fromTo: state => {
    return state.expensesFromTo;
  },
  expenseById: state => id => {
    return state.expensesCurrentMonth.find(exp => exp._id === id);
  },
};

const mutations = {
  editingExpenseRequest(state) {
    state.editingExpenseRequest = true;
    state.expensesError = "";
    state.expensesErrorStatus = 0;
  },

  editingExpenseSuccess(state, expenses) {
    state.editingExpenseRequest = false;
    state.expensesCurrentMonth = expenses;
  },

  editingExpenseError(state, { errorCode, errorMessage }) {
    state.editingExpenseRequest = false;
    state.expensesError = errorCode;
    state.expensesErrorStatus = errorMessage;
  },

  deletingExpenseRequest(state) {
    state.deletingExpenseRequest = true;
    state.expensesError = "";
    state.expensesErrorStatus = 0;
  },

  deletingExpenseSuccess(state, expenses) {
    state.deletingExpenseRequest = false;
    state.expensesCurrentMonth = expenses;
  },

  deletingExpenseError(state, { errorCode, errorMessage }) {
    state.editingExpenseRequest = false;
    state.expensesError = errorCode;
    state.expensesErrorStatus = errorMessage;
  },

  creatingExpenseRequest(state) {
    state.creatingExpenseRequest = true;
    state.expensesError = "";
    state.expensesErrorStatus = 0;
  },

  creatingExpenseSuccess(state, expenses) {
    state.creatingExpenseRequest = false;
    state.expensesCurrentMonth = expenses;
  },

  creatingExpenseError(state, { errorCode, errorMessage }) {
    state.creatingExpenseRequest = false;
    state.expensesError = errorCode;
    state.expensesErrorStatus = errorMessage;
  },

  expensesCurrentMonthRequest(state) {
    state.requestingExpensesCurrentMonth = true;
    state.expensesError = "";
    state.expensesErrorStatus = 0;
  },

  expensesCurrentMonthSuccess(state, expenses) {
    state.expensesCurrentMonth = expenses;
    state.requestingExpensesCurrentMonth = false;
  },

  expensesCurrentMonthError(state, { errorCode, errorMessage }) {
    state.requestingExpensesCurrentMonth = false;
    state.expensesError = errorCode;
    state.expensesErrorStatus = errorMessage;
  },

  expensesFromToRequest(state) {
    state.requestingExpensesFromTo = true;
    state.expensesError = "";
    state.expensesErrorStatus = 0;
  },

  expensesFromToSuccess(state, expenses) {
    state.expensesCurrentMonth = expenses;
    state.requestingExpensesFromTo = false;
  },

  expensesFromToError(state, { errorCode, errorMessage }) {
    state.requestingExpensesFromTo = false;
    state.expensesError = errorCode;
    state.expensesErrorStatus = errorMessage;
  },

  reset(state) {
    state.expensesCurrentMonth = [];
    state.expensesFromTo = [];
  },
};

const actions = {
  currentMonth: async context => {
    try {
      context.commit("expensesCurrentMonthRequest");

      const expenses = await ExpensesService.api.getCurrentMonth();

      context.commit("expensesCurrentMonthSuccess", expenses);
      ExpensesService.local.setExpensesCurrentMonth(expenses);

      return expenses;
    } catch (e) {
      console.log("EXPENSES Current Month ", e);
      if (e.name === "ExpensesError") {
        context.commit("expensesError", {
          errorCode: e.status,
          errorMessage: e.message,
        });
      }
      return false;
    }
  },

  fromTo: async (context, from, to) => {
    try {
      context.commit("expensesFromToRequest");

      const expenses = await ExpensesService.api.getFromTo(from, to);

      context.commit("expensesFromToSuccess", expenses);
      ExpensesService.local.setExpensesFromTo(expenses);

      return expenses;
    } catch (e) {
      console.log("EXPENSES FROM TO ", e);
      if (e.name === "ExpensesError") {
        context.commit("expensesError", {
          errorCode: e.status,
          errorMessage: e.message,
        });
      }
      return false;
    }
  },

  create: async (context, expense) => {
    try {
      context.commit("creatingExpenseRequest");

      const currentExpenses = store.getters["expenses/currentMonth"];
      const createdExpenses = await ExpensesService.api.create(expense);

      let created = null;

      if (Array.isArray(createdExpenses)) {
        created = createdExpenses[0];
      } else {
        created = createdExpenses;
      }

      const expenses = [...currentExpenses, created];

      ExpensesService.local.setExpensesCurrentMonth(expenses);

      context.commit("creatingExpenseSuccess", expenses);
      return created;
    } catch (error) {
      console.log(error);
      return false;
    }
  },

  edit: async (context, expense) => {
    try {
      context.commit("editingExpenseRequest");

      const id = expense._id;
      delete expense._id; // not changable, so its not allowed in the PUT

      let expenses = store.getters["expenses/currentMonth"];

      const editedExpense = await ExpensesService.api.edit(id, expense);

      const toEditExpense = expenses.find(exp => exp._id === id);

      Object.assign(toEditExpense, editedExpense);

      ExpensesService.local.setExpensesCurrentMonth(expenses);

      context.commit("editingExpenseSuccess", expenses);

      return editedExpense;
    } catch (error) {
      console.log(error);
      return false;
    }
  },

  reset: context => {
    context.commit("reset");
    ExpensesService.local.removeExpensesCurrentMonth();
    ExpensesService.local.removeExpensesFromTo();
  },

  delete: async (context, id) => {
    try {
      if (id) {
        context.commit("deletingExpenseRequest");

        await ExpensesService.api.delete(id);

        const expenses = store.getters["expenses/currentMonth"].filter(
          exp => exp._id !== id,
        );

        ExpensesService.local.setExpensesCurrentMonth(expenses);

        context.commit("deletingExpenseSuccess", expenses);

        return true;
      } else {
        throw { name: "Deleting Expense", message: "No ID given." };
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  },
};

export const ExpensesStore = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
