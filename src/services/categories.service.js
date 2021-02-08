import { ApiService } from "@/services/api.service.js";

const CATEGORIES = "categories";

const CategoriesService = {
  api: {
    async getAll() {
      return await ApiService.get("categories");
    },
  },

  local: {
    setAll(categories) {
      localStorage.setItem(CATEGORIES, JSON.stringify(categories));
    },
    getAll() {
      return JSON.parse(localStorage.getItem(CATEGORIES));
    },
    removeAll() {
      return localStorage.removeItem(CATEGORIES);
    },
  },
};

export { CategoriesService };
