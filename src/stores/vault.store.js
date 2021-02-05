import { VaultService } from "@/services/vault.service.js";

const state = {
  name: VaultService.local.getName(),
  owner: VaultService.local.getOwner(),
  sellingPoints: VaultService.local.getSellingPoints(),
  shared: VaultService.local.getSellingPoints(),
  _id: VaultService.local.getId(),
  requestingVault: false,
  requestingAllVaults: false,
  vaults: VaultService.local.getAllVaults(),
};

const getters = {
  name: state => {
    return state.name;
  },
  id: state => {
    return state._id;
  },
  owner: state => {
    return state.owner;
  },
  sellingPoints: state => {
    return state.sellingPoints;
  },
  shared: state => {
    return state.shared;
  },
  allVaults: state => {
    return state.vaults;
  },
};

const mutations = {
  vaultRequest(state) {
    state.requestingVault = true;
    state.vaultError = "";
    state.vaultErrorCode = 0;
  },

  vaultSuccess(state, vault) {
    state.name = vault.name;
    state.owner = vault.owner;
    state.shared = vault.shared;
    state.sellingPoints = vault.sellingPoints;
    state._id = vault._id;
    state.requestingVault = false;
  },

  vaultError(state, { errorCode, errorMessage }) {
    state.requestingVault = false;
    state.vaultError = errorCode;
    state.vaultErrorCode = errorMessage;
  },

  allVaultsRequest(state) {
    state.requestingAllVaults = true;
    state.vaultError = "";
    state.vaultErrorCode = 0;
  },

  allVaultsSuccess(state, vaults) {
    state.vaults = vaults;
    state.requestingVault = false;
  },

  allVaultsError(state, { errorCode, errorMessage }) {
    state.requestingVault = false;
    state.vaultError = errorCode;
    state.vaultErrorCode = errorMessage;
  },

  setName(state, name) {
    state.name = name;
  },

  setShared(state, shared) {
    state.shared = shared;
  },

  setSellingPoints(state, sellingPoints) {
    state.sellingPoints = sellingPoints;
  },
};

const actions = {
  set: async (context, id) => {
    try {
      let vault = await VaultService.api.get(id);

      VaultService.local.setVault(vault);

      context.commit("vaultSuccess", vault);

      return vault;
    } catch (e) {
      if (e.name === "VaultError") {
        context.commit("vaultError", {
          errorCode: e.status,
          errorMessage: e.message,
        });
      }
      return false;
    }
  },

  setAllVaults: async context => {
    try {
      let vaults = await VaultService.api.getAll();

      VaultService.local.setAllVaults(vaults);

      context.commit("allVaultsSuccess", vaults);

      return vaults;
    } catch (e) {
      if (e.name === "AllVaultsError") {
        context.commit("allVaultsError", {
          errorCode: e.status,
          errorMessage: e.message,
        });
      }
      return false;
    }
  },
};

export const VaultStore = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
