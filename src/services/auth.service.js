import { ApiService } from "@/services/api.service.js";
import axios from "axios";

const AuthService = {
  async login(email, password) {
    return new Promise((resolve, reject) => {
      ApiService.post("auth/login", {
        password: password,
        email: email,
      })
        .then(tokens => {
          resolve(tokens);
        })
        .catch(err => {
          reject({
            name: "LoginError",
            message: err.response.data.error.message,
            status: err.response.status,
          });
        });
    });
  },

  async logout(refreshToken) {
    return new Promise((resolve, reject) => {
      ApiService.delete("auth/logout", {
        refreshToken: refreshToken,
      })
        .then(() => {
          resolve(true);
        })
        .catch(err => {
          reject(err);
        });
    });
  },

  async refreshAccessToken(refreshToken) {
    return new Promise((resolve, reject) => {
      axios
        .post(`${ApiService.getBaseUrl()}auth/refresh-tokens`, {
          refreshToken: refreshToken,
        })
        .then(res => {
          resolve(res.data);
        })
        .catch(err => {
          reject({
            name: "RefreshTokensError",
            message: err.response.data.error.message,
            status: err.response.status,
          });
        });
    });
  },
};

export { AuthService };
