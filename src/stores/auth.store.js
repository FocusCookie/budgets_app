import { AuthService } from "@/services/auth.service.js";
import { TokenService } from "@/services/token.service";
import router from "@/router/index";

const state = {
  authenticating: false,
  accessToken: TokenService.getAccessToken(),
  refreshToken: TokenService.getRefreshToken(),
  authenticationErrorCode: 0,
  authenticationError: "",
};

const getters = {
  loggedIn: state => {
    return state.accessToken ? true : false;
  },

  authenticationErrorCode: state => {
    return state.authenticationErrorCode;
  },

  authenticationError: state => {
    return state.authenticationError;
  },

  authenticating: state => {
    return state.authenticating;
  },

  accessToken: state => {
    return state.accessToken;
  },

  refreshToken: state => {
    return state.refreshToken;
  },
};

const mutations = {
  loginRequest(state) {
    state.authenticating = true;
    state.authenticationError = "";
    state.authenticationErrorCode = 0;
  },

  loginSuccess(state, tokens) {
    state.accessToken = tokens.accessToken;
    state.refreshToken = tokens.refreshToken;
    state.authenticating = false;
  },

  loginError(state, { errorCode, errorMessage }) {
    state.authenticating = false;
    state.authenticationErrorCode = errorCode;
    state.authenticationError = errorMessage;
  },

  logoutSuccess(state) {
    state.loggingOut = false;
    state.accessToken = "";
    state.refreshToken = "";
  },

  refreshTokensRequest(state) {
    state.authenticating = true;
    state.authenticationError = "";
    state.authenticationErrorCode = 0;
  },

  refreshTokensError(state, { errorCode, errorMessage }) {
    state.authenticating = false;
    state.authenticationError = errorMessage;
    state.authenticationErrorCode = errorCode;
    state.accessToken = "";
    state.refreshToken = "";
  },

  refreshTokensSuccess(state, tokens) {
    state.authenticating = false;
    state.accessToken = tokens.accessToken;
    state.refreshToken = tokens.refreshToken;
  },
};

const actions = {
  login: async (context, payload) => {
    try {
      context.commit("loginRequest");
      const tokens = await AuthService.login(payload.email, payload.password);
      context.commit("loginSuccess", tokens);

      TokenService.saveAccessToken(tokens.accessToken);
      TokenService.saveRefreshToken(tokens.refreshToken);

      // Redirect the user to the page he first tried to visit or to the home view
      router.push(router.history.current.query.redirect || "/home");

      return true;
    } catch (e) {
      if (e.name === "LoginError") {
        context.commit("loginError", {
          errorCode: e.status,
          errorMessage: e.message,
        });
      }

      return false;
    }
  },

  logout: async context => {
    try {
      TokenService.removeAccessToken();
      await AuthService.logout(state.refreshToken);
      TokenService.removeRefreshToken(); // can be deleted after the refreshToken was deleted by the backend
      context.commit("logoutSuccess");
      router.push("/login");
    } catch (err) {
      TokenService.removeRefreshToken(); // can be deleted after the refreshToken was deleted by the backend
      context.commit("logoutSuccess");
      router.push("/login");
      console.log(err);
    }
  },

  refreshTokens: async context => {
    try {
      context.commit("refreshTokensRequest");

      if (state.refreshToken) {
        const tokens = await AuthService.refreshAccessToken(state.refreshToken);

        context.commit("refreshTokensSuccess", tokens);

        TokenService.saveAccessToken(tokens.accessToken);
        TokenService.saveRefreshToken(tokens.refreshToken);

        return true;
      }
    } catch (e) {
      if (e.name === "RefreshTokensError") {
        // If the refresh of the token was not possible initiate the "logout" and remove the tokens
        TokenService.removeAccessToken();
        TokenService.removeRefreshToken(); // can be deleted after the refreshToken was deleted by the backend

        context.commit("refreshTokensError", {
          errorCode: e.status,
          errorMessage: e.message,
        });
      }

      return false;
    }
  },
};

export const AuthStore = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
