import { CategoriesService } from "@/services/categories.service.js";

const state = {
  categories: CategoriesService.local.getAll(),
  requestingCategories: false,
  categoriesError: "",
  categoriesErrorCode: 0,
};

const getters = {
  all: state => {
    return state.categories;
  },
};

const mutations = {
  categoriesRequest(state) {
    state.requestingCategories = true;
    state.categoriesError = "";
    state.categoriesErrorCode = 0;
  },

  categoriesSuccess(state, categories) {
    state.categories = categories;
    state.requestingCategories = false;
  },

  categoriesError(state, { errorCode, errorMessage }) {
    state.requestingCategories = false;
    state.categoriesError = errorCode;
    state.categoriesErrorCode = errorMessage;
  },
};

const actions = {
  setAll: async context => {
    try {
      context.commit("categoriesRequest");
      let categories = await CategoriesService.api.getAll();

      CategoriesService.local.setAll(categories);

      context.commit("categoriesSuccess", categories);

      return categories;
    } catch (e) {
      if (e.name === "CategoriesError") {
        context.commit("categoriesError", {
          errorCode: e.status,
          errorMessage: e.message,
        });
      }
      return false;
    }
  },
};

export const CategoriesStore = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
