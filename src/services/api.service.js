import axios from "axios";
import { store } from "@/services/store.service.js";

const ApiService = {
  init(baseURL) {
    axios.defaults.baseURL = baseURL;
  },

  checkAuthHeader() {
    if (store.getters["auth/accessToken"] !== "") {
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${store.getters["auth/accessToken"]}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  },

  get(resource) {
    this.checkAuthHeader();
    return axios.get(resource);
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
