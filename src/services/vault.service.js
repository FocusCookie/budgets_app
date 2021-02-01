import { ApiService } from "@/services/api.service.js";

const VaultService = {
  async getAll() {
    const vaults = await ApiService.get("vaults");

    return vaults;
  },

  async create(name) {
    const createdVault = await ApiService.post("vaults", { name: name });

    return createdVault;
  },

  async edit(id, name) {
    const editedVault = await ApiService.post(`vaults/${id}`, { name: name });

    return editedVault;
  },

  async delete(id) {
    const editedVault = await ApiService.delete(`vaults/${id}`);

    return editedVault.statusCode === 204 ? true : false;
  },

  async giveAVaultAccess(vaultId, userId) {
    const accessGranted = await ApiService.post(
      `vaults/${vaultId}/share/${userId}`,
    );

    return accessGranted.statusCode === 204 ? true : false;
  },

  async revokeVaultAccess(vaultId, userId) {
    const accessRevoked = await ApiService.post(
      `vaults/${vaultId}/share/${userId}`,
    );

    return accessRevoked.statusCode === 204 ? true : false;
  },
};

export { VaultService };
