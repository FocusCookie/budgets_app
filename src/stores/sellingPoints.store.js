import { SellingPointsService } from "@/services/sellingPoints.service.js";

const state = {
  sellingPoints: false,
  requestingSellingPoints: false,
  sellingPointsError: "",
  sellingPointsErrorCode: 0,
};

const getters = {
  name: state => {
    return state.sellingPoints;
  },
};

const mutations = {
  sellingPointsRequest(state) {
    state.requestingSellingPoints = true;
    state.sellingPointsError = "";
    state.sellingPointsErrorCode = 0;
  },

  sellingPointsSuccess(state, categories) {
    state.categories = categories;
    state.requestingSellingPoints = false;
  },

  sellingPointsError(state, { errorCode, errorMessage }) {
    state.requestingSellingPoints = false;
    state.sellingPointsError = errorCode;
    state.sellingPointsErrorCode = errorMessage;
  },
};

const actions = {
  setAll: async context => {
    try {
      context.commit("sellingPointsRequest");

      let sellingPoints = await SellingPointsService.api.getAll();

      SellingPointsService.local.setAll(sellingPoints);

      context.commit("sellingPointsSuccess", sellingPoints);

      return sellingPoints;
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