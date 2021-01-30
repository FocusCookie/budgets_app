import { ApiService } from "@/services/api.service.js";

const AuthService = {
  async login(email, password) {
    return new Promise((resolve, reject) => {
      ApiService.post("auth/login", {
        password: password,
        email: email,
      })
        .then(res => {
          resolve(res.data);
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
};

export { AuthService };
