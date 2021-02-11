const USER_NAME = "userName";
const USER_ID = "userId";
const USER_ROLE = "userRole";
const USER_MAIN_VAULT = "userMainVault";
const USER_FIRST_TIME = "userFirstTime";

import { ApiService } from "@/services/api.service.js";
import { store } from "@/services/store.service.js";

const UserService = {
  api: {
    async edit(id, name) {
      const editedVault = await ApiService.post(`vaults/${id}`, { name: name });

      return editedVault;
    },

    async delete(id) {
      const editedVault = await ApiService.delete(`vaults/${id}`);

      return editedVault.statusCode === 204 ? true : false;
    },

    async setMainVault(vault) {
      await ApiService.post(
        `users/${store.getters["user/id"]}/mainvault/${vault}`,
      );

      await store.dispatch("user/setMainVault", vault);
      return true;
    },

    async resetMainVault() {
      await ApiService.delete(`users/${store.getters["user/id"]}/mainvault`);

      await store.dispatch("user/setMainVault", "");
      return true;
    },
  },
  local: {
    saveUser(user) {
      const vault =
        user.mainVault !== "" && user.mainVault !== undefined
          ? user.mainVault
          : "";

      localStorage.setItem(USER_NAME, user.name);
      localStorage.setItem(USER_ID, user.aud);
      localStorage.setItem(USER_ROLE, user.role);
      localStorage.setItem(USER_MAIN_VAULT, vault);
    },

    removeUser() {
      localStorage.removeItem(USER_NAME);
      localStorage.removeItem(USER_ID);
      localStorage.removeItem(USER_ROLE);
      localStorage.removeItem(USER_MAIN_VAULT);
      localStorage.removeItem(USER_FIRST_TIME);
    },

    saveMainVault(vault) {
      const vaultValue = vault !== "" && vault !== undefined ? vault : "";
      localStorage.setItem(USER_MAIN_VAULT, vaultValue);
    },

    saveFirstTime(firstTime) {
      localStorage.setItem(USER_FIRST_TIME, JSON.stringify(firstTime));
    },

    getName() {
      return localStorage.getItem(USER_NAME);
    },
    getRole() {
      return localStorage.getItem(USER_ROLE);
    },
    getId() {
      return localStorage.getItem(USER_ID);
    },
    getMainVault() {
      return localStorage.getItem(USER_MAIN_VAULT);
    },
    getFirstTime() {
      return JSON.parse(localStorage.getItem(USER_FIRST_TIME));
    },
  },
};

export { UserService };
