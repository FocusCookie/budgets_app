import { ApiService } from "@/services/api.service.js";
import { store } from "@/services/store.service.js";

const ExpensesService = {
  api: {
    async getCurrentMonth() {
      const vaultId = store.getters["vault/id"];
      return await ApiService.get(`expenses/vault/${vaultId}`);
    },
  },

  local: {},
};

export { ExpensesService };
