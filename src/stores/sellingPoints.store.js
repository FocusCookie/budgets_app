import { SellingPointsService } from "@/services/sellingPoints.service.js";
import { store } from "@/services/store.service.js";

const state = {
  sellingPoints: SellingPointsService.local.getAll(),
  requestingSellingPoints: false,
  sellingPointsError: "",
  sellingPointsErrorCode: 0,
};

const getters = {
  all: state => {
    return state.sellingPoints;
  },
};

const mutations = {
  sellingPointsRequest(state) {
    state.requestingSellingPoints = true;
    state.sellingPointsError = "";
    state.sellingPointsErrorCode = 0;
  },

  sellingPointsSuccess(state, sellingPoints) {
    state.sellingPoints = sellingPoints;
    state.requestingSellingPoints = false;
  },

  sellingPointsError(state, { errorCode, errorMessage }) {
    state.requestingSellingPoints = false;
    state.sellingPointsError = errorCode;
    state.sellingPointsErrorCode = errorMessage;
  },

  addSellingPointsRequest(state) {
    state.creatingServicePointRequest = true;
    state.sellingPointsError = "";
    state.sellingPointsErrorCode = 0;
  },

  addSellingPointsSuccess(state, sellingPoints) {
    state.sellingPoints = sellingPoints;
    state.creatingServicePointRequest = false;
  },

  addSellingPointsError(state, { errorCode, errorMessage }) {
    state.creatingServicePointRequest = false;
    state.sellingPointsError = errorCode;
    state.sellingPointsErrorCode = errorMessage;
  },
};

const actions = {
  setAll: async context => {
    try {
      context.commit("sellingPointsRequest");

      // remove all sellingPoints that are currently set
      SellingPointsService.local.removeAll();

      // push all the users sellingPoints and the sellingPoints where the user has access to form the choosen vault
      const userSellingPoints = await SellingPointsService.api.getAll();

      const vaultSellingPoints = store.getters["vault/sellingPoints"]
        ? store.getters["vault/sellingPoints"]
        : []; // necessary because the store returns null if the item is not there

      const uniqueUserSP =
        vaultSellingPoints.length > 0
          ? userSellingPoints.filter(usp => {
              return vaultSellingPoints.some(vsp => usp.name !== vsp.name);
            })
          : userSellingPoints;

      const sellingPoints = [...vaultSellingPoints, ...uniqueUserSP];

      SellingPointsService.local.setAll(sellingPoints);
      context.commit("sellingPointsSuccess", sellingPoints);

      return sellingPoints;
    } catch (e) {
      console.log("SP ", e);
      if (e.name === "SellingPointError") {
        context.commit("sellingPointError", {
          errorCode: e.status,
          errorMessage: e.message,
        });
      }
      return false;
    }
  },

  add: async (context, sellingPoint) => {
    try {
      context.commit("addSellingPointsRequest");

      const newSellingPoint = await SellingPointsService.api.create(
        sellingPoint,
      );
      const sellingPoints = [
        ...store.getters["sellingPoints/all"],
        newSellingPoint,
      ];

      context.commit("addSellingPointsSuccess", sellingPoints);

      SellingPointsService.local.setAll(sellingPoints);

      return newSellingPoint;
    } catch (e) {
      console.log(e);
      if (e.name === "SellingPointError") {
        context.commit("sellingPointError", {
          errorCode: e.status,
          errorMessage: e.message,
        });
      }
      return false;
    }
  },
};

export const SellingPointsStore = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
