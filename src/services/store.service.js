import Vue from "vue";
import Vuex from "vuex";

// STORES
import { AuthStore } from "@/stores/auth.store.js";
import { UserStore } from "@/stores/user.store.js";
import { VaultStore } from "@/stores/vault.store.js";
import { ExpensesStore } from "@/stores/expenses.store.js";
import { CategoriesStore } from "@/stores/categories.store.js";
import { SellingPointsStore } from "@/stores/sellingPoints.store.js";

Vue.use(Vuex);

export const store = new Vuex.Store({
  modules: {
    auth: AuthStore,
    user: UserStore,
    vault: VaultStore,
    expenses: ExpensesStore,
    categories: CategoriesStore,
    sellingPoints: SellingPointsStore,
  },
});
