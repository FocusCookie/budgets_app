import { ExpensesService } from "@/services/expenses.service.js";
import { store } from "@/services/store.service.js";

const state = {
  expensesCurrentMonth: ExpensesService.local.getExpensesCurrentMonth(),
  expensesFromTo: ExpensesService.local.getExpensesFromTo(),
  requestingExpensesCurrentMonth: false,
  requestingExpensesFromTo: false,
  creatingExpenseRequest: false,
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
};

const mutations = {
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
      const createdExpense = await ExpensesService.api.create(expense);

      const expenses = [...currentExpenses, createdExpense];

      ExpensesService.local.setExpensesCurrentMonth(expenses);

      context.commit("creatingExpenseSuccess", expenses);
      return createdExpense;
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
};

export const ExpensesStore = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
