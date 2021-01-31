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

  post(resource, data) {
    this.checkAuthHeader();
    return axios.post(resource, data);
  },

  put(resource, data) {
    this.checkAuthHeader();
    return axios.put(resource, data);
  },

  delete(resource, data) {
    this.checkAuthHeader();
    return axios.delete(resource, { data: data });
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
