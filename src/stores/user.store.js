import jwt_decode from "jwt-decode";
import { UserService } from "@/services/user.service";

const state = {
  id: UserService.local.getId(),
  name: UserService.local.getName(),
  role: UserService.local.getRole(),
  mainVault: UserService.local.getMainVault(),
  firstTimeLoggedIn: UserService.local.getFirstTime(),
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
  firstTimeUser: () => {
    return state.firstTimeLoggedIn;
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

  firstTimeUser(state, firstTime) {
    state.firstTimeLoggedIn = firstTime;
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
        email: user.email,
      });

      UserService.local.saveUser(user);

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

  setMainVault: (context, vault) => {
    UserService.local.saveMainVault(vault);
    context.commit("mainVault", vault);
  },

  setFirstTimeUser: (context, firstTime) => {
    UserService.local.saveFirstTime(firstTime);
    context.commit("firstTimeUser", firstTime);
  },
};

export const UserStore = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
