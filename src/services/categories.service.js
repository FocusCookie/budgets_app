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
      return localStorage.getItem(CATEGORIES);
    },
  },
};

export { CategoriesService };
