<template>
  <div class="vaultsWrapper text-left">
    <v-card
      class="mx-auto my-4 pa-4 rounded-lg"
      :outlined="selected"
      :loading="loading"
      @click="setToMainVault"
    >
      <div class="d-flex justify-space-between align-center">
        <span :class="`text-h6 ${selected ? '' : 'primary--text'}`">{{
          vault.name.toUpperCase()
        }}</span>

        <v-chip v-if="!userIsTheOwner" color="primary" label>
          <v-icon left>
            mdi-account-circle-outline
          </v-icon>
          {{ vault.owner.name }}
        </v-chip>
        <v-btn v-if="selected && userIsTheOwner" dark fab small color="primary">
          <v-icon small dark>
            mdi-pen
          </v-icon>
        </v-btn>
      </div>
    </v-card>

    <EditVaultDialog
      v-if="showVaultEditDialog"
      :vault="vault"
      @changed="showVaultEditDialog = false"
      @canceled="showVaultEditDialog = false"
      @deleted="deleteVault"
    />
  </div>
</template>

<script>
import EditVaultDialog from "@/components/EditVaultDialog.vue";
import { UserService } from "@/services/user.service.js";

export default {
  name: "VaultCard",
  validations: {},
  components: { EditVaultDialog },
  props: ["vault"],
  data() {
    return {
      loading: false,
      showVaultEditDialog: false,
    };
  },
  computed: {
    selected() {
      return this.$store.getters["vault/id"] === this.vault._id;
    },
    userIsTheOwner() {
      return this.vault.owner._id === this.$store.getters["user/id"];
    },
  },
  watch: {},
  created() {},
  methods: {
    async setToMainVault() {
      if (this.vault._id !== this.$store.getters["vault/id"]) {
        this.loading = true;
        await UserService.api.setMainVault(this.vault._id);

        await this.$store.dispatch("vault/set", this.vault._id);

        // set the sellingPoints (combined from vault and user)
        await this.$store.dispatch("sellingPoints/setAll");

        // load all expenses from the mainVault
        await this.$store.dispatch("expenses/currentMonth");

        this.loading = false;
      } else {
        if (this.userIsTheOwner) {
          this.showVaultEditDialog = true;
        }
      }
    },
    async deleteVault() {
      // check if there is another vault to set as main vault, if not set firstTime user
      //check if mainVault is set
      const mainVault = this.$store.getters["user/mainVault"];

      // if no mainVault is set check if the user has access to other vaults
      if (!mainVault) {
        // check and set  all accessable vaults
        const vaults = await this.$store.dispatch("vault/setAllVaults");

        // if the user has access to vaults set the mainVault to the first vault
        if (vaults.length > 0) {
          await UserService.api.setMainVault(vaults[0]._id);
        } else {
          // set firstTime user
          await this.$store.dispatch("user/setMainVault", "");
          await this.$store.dispatch("user/setFirstTimeUser", true);
        }
      }

      this.showVaultEditDialog = false;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.vaultsWrapper {
  height: inherit;
}
.card-disabled-opacity {
  opacity: 1;
}
</style>
