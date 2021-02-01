const USER_NAME = "userName";
const USER_ID = "userId";
const USER_ROLE = "userRole";
const USER_MAIN_VAULT = "userMainVault";

import { ApiService } from "@/services/api.service.js";

const UserService = {
  async edit(id, name) {
    const editedVault = await ApiService.post(`vaults/${id}`, { name: name });

    return editedVault;
  },

  async delete(id) {
    const editedVault = await ApiService.delete(`vaults/${id}`);

    return editedVault.statusCode === 204 ? true : false;
  },

  async getUserIdByEmail(email) {
    try {
      const user = await ApiService.get(`users/email/${email}`);

      return user;
    } catch (error) {
      throw {
        name: "GetUserIdByEmail",
        message: error.response.data.error.message,
      };
    }
  },

  saveUser(user) {
    localStorage.setItem(USER_NAME, user.name);
    localStorage.setItem(USER_ID, user.aud);
    localStorage.setItem(USER_ROLE, user.role);
    localStorage.setItem(USER_MAIN_VAULT, user.mainVault);
  },

  getName() {
    return localStorage.getItem(USER_NAME);
  },
  getRole() {
    return localStorage.getItem(USER_ROLE);
  },
  getId() {
    return localStorage.getItem(USER_ID);
  },
  getMainVault() {
    return localStorage.getItem(USER_MAIN_VAULT);
  },
};

export { UserService };
