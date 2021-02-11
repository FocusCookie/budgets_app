import { ApiService } from "@/services/api.service.js";
import { store } from "@/services/store.service.js";

const EXPENSES_CURRENT_MONTH = "expensesCurrentMonth";
const EXPENSES_FROM_TO = "expensesFromTo";

const ExpensesService = {
  api: {
    async getCurrentMonth() {
      const vaultId = store.getters["vault/id"];
      return vaultId ? ApiService.get(`expenses/vault/${vaultId}`) : [];
    },

    async getFromTo(from, to) {
      const vaultId = store.getters["vault/id"];

      const request = to
        ? `expenses/vault/${vaultId}/timeframe/?from=${from}&to=${to}`
        : `expenses/vault/${vaultId}/timeframe/?from=${from}`;

      return ApiService.get(request);
    },

    async create(expense) {
      return ApiService.post("expenses", expense);
    },

    async edit(id, expense) {
      console.log("API ", expense);
      return ApiService.put(`expenses/${id}`, expense);
    },

    async delete(id) {
      const deleted = await ApiService.delete(`expenses/${id}`);

      return deleted.statusCode === 204 ? true : false;
    },
  },

  local: {
    setExpensesCurrentMonth(expenses) {
      localStorage.setItem(EXPENSES_CURRENT_MONTH, JSON.stringify(expenses));
    },

    getExpensesCurrentMonth() {
      return JSON.parse(localStorage.getItem(EXPENSES_CURRENT_MONTH));
    },

    removeExpensesCurrentMonth() {
      localStorage.removeItem(EXPENSES_CURRENT_MONTH);
    },

    setExpensesFromTo(expenses) {
      localStorage.setItem(EXPENSES_FROM_TO, JSON.stringify(expenses));
    },

    getExpensesFromTo() {
      return JSON.parse(localStorage.getItem(EXPENSES_FROM_TO));
    },

    removeExpensesFromTo() {
      localStorage.removeItem(EXPENSES_FROM_TO);
    },
  },
};

export { ExpensesService };
