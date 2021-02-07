// import { ExpensesService } from "@/services/expenses.service.js";

const state = {
  currentMonth: "",
};

const getters = {
  currentMonth: state => {
    return state.currentMonth;
  },
};

const mutations = {};

const actions = {};

export const ExpensesStore = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
