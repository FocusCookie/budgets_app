import jwt_decode from "jwt-decode";
import { UserService } from "@/services/user.service";

const state = {
  id: UserService.getId(),
  name: UserService.getName(),
  role: UserService.getRole(),
  mainVault: UserService.getMainVault(),
};

const getters = {
  name: () => {
    return state.name;
  },
  id: () => {
    return state.id;
  },
  role: () => {
    return state.role;
  },
  mainVault: () => {
    return state.mainVault;
  },
};

const mutations = {
  initUser(state, payload) {
    state.name = payload.name;
    state.role = payload.role;
    state.mainVault = payload.mainVault;
    state.id = payload.id;
  },

  name(state, name) {
    state.name = name;
  },

  mainVault(state, vault) {
    state.mainVault = vault;
  },
};

const actions = {
  init: (context, payload) => {
    try {
      const user = jwt_decode(payload.accessToken);

      context.commit("initUser", {
        id: user.aud,
        name: user.name,
        role: user.role,
        mainVault: user.mainVault,
      });

      UserService.saveUser(user);

      return true;
    } catch (error) {
      throw {
        name: "InitUser",
        message: error.name,
        status: error.message,
      };
    }
  },

  setName: (context, name) => {
    context.commit("name", name);
  },

  setMainVault: (context, mainVault) => {
    context.commit("mainVault", mainVault);
  },
};

export const UserStore = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
