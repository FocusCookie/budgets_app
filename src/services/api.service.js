import axios from "axios";
import { store } from "@/services/store.service.js";

const ApiService = {
  init(baseURL) {
    axios.defaults.baseURL = baseURL;
  },

  getBaseUrl() {
    return axios.defaults.baseURL;
  },

  checkAuthHeader() {
    if (store.getters["auth/accessToken"]) {
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${store.getters["auth/accessToken"]}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  },

  async get(resource) {
    try {
      this.checkAuthHeader();
      const response = await axios.get(resource);
      return response.data;
    } catch (error) {
      if (
        error.response.data.error.status === 401 &&
        error.response.data.error.message === "jwt expired"
      ) {
        const tokensRefreshed = await store.dispatch("auth/refreshTokens");

        if (tokensRefreshed) {
          return this.get(resource);
        } else {
          throw {
            name: "RefreshTokensError",
            message:
              "Access Token and Refresh Token expired. Please login again.",
          };
        }
      }
    }
  },

  async post(resource, data) {
    try {
      this.checkAuthHeader();
      const response = await axios.post(resource, data);
      return response.data;
    } catch (error) {
      if (
        error.response.data.error.status === 401 &&
        error.response.data.error.message === "jwt expired"
      ) {
        const tokensRefreshed = await store.dispatch("auth/refreshTokens");

        if (tokensRefreshed) {
          return this.post(resource, data);
        } else {
          throw {
            name: "RefreshTokensError",
            message:
              "Access Token and Refresh Token expired. Please login again.",
          };
        }
      }
    }
  },

  async put(resource, data) {
    try {
      this.checkAuthHeader();
      const response = await axios.put(resource, data);
      return response.data;
    } catch (error) {
      if (
        error.response.data.error.status === 401 &&
        error.response.data.error.message === "jwt expired"
      ) {
        const tokensRefreshed = await store.dispatch("auth/refreshTokens");

        if (tokensRefreshed) {
          return this.put(resource, data);
        } else {
          throw {
            name: "RefreshTokensError",
            message:
              "Access Token and Refresh Token expired. Please login again.",
          };
        }
      }
    }
  },

  async delete(resource, data) {
    try {
      this.checkAuthHeader();
      const response = await axios.delete(resource, { data: data });

      return response.data;
    } catch (error) {
      console.log(error);
      if (
        error.response.data.error.status === 401 &&
        error.response.data.error.message === "jwt expired"
      ) {
        const tokensRefreshed = await store.dispatch("auth/refreshTokens");

        if (tokensRefreshed) {
          return this.delete(resource, data);
        } else {
          throw {
            name: "RefreshTokensError",
            message:
              "Access Token and Refresh Token expired. Please login again.",
          };
        }
      }
    }
  },

  /**
   * Perform a custom axios request.
   *
   * data is an object containing the following properties:
   *  - method
   *  - url
   *  - data ... request payload
   *  - auth (optional)
   *    - username
   *    - password
   **/
  customRequest(data) {
    return axios(data);
  },
};

export { ApiService };
