const VAULT_NAME = "vaultName";
const VAULT_OWNER = "vaultOwner";
const VAULT_SELLINGPOINTS = "vaultSellingPoints";
const VAULT_SHARED = "vaultShared";
const VAULT_ID = "vaultId";

import { ApiService } from "@/services/api.service.js";

const VaultService = {
  api: {
    async getAll() {
      const vaults = await ApiService.get("vaults");

      return vaults;
    },

    async get(id) {
      if (!id) throw { name: "GET vault/id", message: "No ID given" };

      const vaults = await ApiService.get(`vaults/${id}`);

      return vaults;
    },

    async create(name) {
      const createdVault = await ApiService.post("vaults", { name: name });

      return createdVault;
    },

    async edit(id, name) {
      const editedVault = await ApiService.post(`vaults/${id}`, { name: name });

      return editedVault;
    },

    async delete(id) {
      const editedVault = await ApiService.delete(`vaults/${id}`);

      return editedVault.statusCode === 204 ? true : false;
    },

    async getVaultsSharedUsers(id) {
      if (!id) throw { name: "GET vault/id", message: "No ID given" };

      const vaults = await ApiService.get(`vaults/${id}/share/`);

      return vaults;
    },

    async giveAccessToVault(id, email) {
      const accessGranted = await ApiService.post(`vaults/${id}/share/`, {
        email: email,
      });

      return accessGranted.statusCode === 204 ? true : false;
    },

    async revokeAccessFromVault(id, email) {
      const accessRevoked = await ApiService.post(`vaults/${id}/share/`, {
        email: email,
      });

      return accessRevoked.statusCode === 204 ? true : false;
    },
  },

  local: {
    setVault(vault) {
      localStorage.setItem(VAULT_NAME, vault.name);
      localStorage.setItem(VAULT_OWNER, vault.owner);
      localStorage.setItem(VAULT_SELLINGPOINTS, vault.sellingPoints);
      localStorage.setItem(VAULT_SHARED, vault.shared);
      localStorage.setItem(VAULT_ID, vault._id);
    },

    getVault() {
      return {
        name: localStorage.getItem(VAULT_NAME),
        owner: localStorage.getItem(VAULT_OWNER),
        sellingPoints: localStorage.getItem(VAULT_SELLINGPOINTS),
        shared: localStorage.getItem(VAULT_SHARED),
        _id: localStorage.getItem(VAULT_ID),
      };
    },

    getName() {
      localStorage.getItem(VAULT_NAME);
    },

    getOwner() {
      localStorage.getItem(VAULT_OWNER);
    },

    getSellingPoints() {
      localStorage.getItem(VAULT_SELLINGPOINTS);
    },

    getShared() {
      localStorage.getItem(VAULT_SELLINGPOINTS);
    },

    getId() {
      localStorage.getItem(VAULT_ID);
    },

    removeVault() {
      localStorage.removeItem(VAULT_NAME);
      localStorage.removeItem(VAULT_OWNER);
      localStorage.removeItem(VAULT_SELLINGPOINTS);
      localStorage.removeItem(VAULT_SHARED);
      localStorage.removeItem(VAULT_ID);
    },
    setName(name) {
      localStorage.setItem(VAULT_NAME, name);
    },
    setSellingPoints(sellingPoints) {
      localStorage.setItem(VAULT_SELLINGPOINTS, sellingPoints);
    },
    setShared(sharedUsers) {
      localStorage.setItem(VAULT_SELLINGPOINTS, sharedUsers);
    },
  },
};

export { VaultService };
