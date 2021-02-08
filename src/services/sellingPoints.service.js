import { ApiService } from "@/services/api.service.js";

const SELLING_POINTS = "sellingPoints";

const SellingPointsService = {
  api: {
    async getAll() {
      return ApiService.get("sellingPoints");
    },

    async get(id) {
      if (!id) throw { name: "GET sellingPoints/id", message: "No ID given" };

      return await ApiService.get(`sellingPoints/${id}`);
    },

    async create(sellingPoint) {
      const createdVault = await ApiService.post("sellingPoints", sellingPoint);

      return createdVault;
    },

    async edit(id, sellingPoint) {
      return ApiService.put(`sellingPoints/${id}`, sellingPoint);
    },

    async delete(id) {
      const editedVault = await ApiService.delete(`sellingPoints/${id}`);

      return editedVault.statusCode === 204 ? true : false;
    },
  },

  local: {
    setAll(sellingPoints) {
      localStorage.setItem(SELLING_POINTS, JSON.stringify(sellingPoints));
    },

    getAll() {
      return JSON.parse(localStorage.getItem(SELLING_POINTS));
    },

    removeAll() {
      localStorage.removeItem(SELLING_POINTS);
    },
  },
};

export { SellingPointsService };
