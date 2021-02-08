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

    <v-dialog v-model="showVaultEditDialog">
      <v-card class="pa-4 rounded-xl">
        <EditVaultDialog
          :vault="vault"
          @changed="closeEditVaultDialog"
          @canceled="closeEditVaultDialog"
          @deleted="closeEditVaultDialog"
        />
      </v-card>
    </v-dialog>
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
    closeEditVaultDialog() {
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
