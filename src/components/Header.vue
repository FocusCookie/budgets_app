<template>
  <div class="wrapper">
    <div class="titleWrapper">
      <div>
        <v-icon v-if="!settingsSelected" color="primary">
          mdi-safe
        </v-icon>
      </div>
      <span class="overline primary--text font-weight-bold">{{
        settingsSelected ? "Settings" : title
      }}</span>
      <div>
        <v-btn
          v-if="!settingsSelected"
          fab
          x-small
          color="primary"
          outlined
          @click="expand = !expand || displayCreateFirstVault"
        >
          <v-icon>{{ expand ? "mdi-chevron-up" : "mdi-chevron-down" }}</v-icon>
        </v-btn>
      </div>
    </div>

    <v-expand-transition>
      <div v-if="expand && showHeaderFullScreen">
        <div class="my-4">
          <v-btn rounded color="primary" @click="showCreateVaultDialog = true">
            Create new vault
          </v-btn>
          <Vaults />
        </div>
      </div>
    </v-expand-transition>

    <v-dialog
      v-model="showCreateVaultDialog"
      :persistent="firstVault"
      @input="closeDialog"
    >
      <v-card class="pa-4 rounded-xl">
        <CreateVaultDialog
          :first-vault="firstVault"
          @created="closeCreateVaultDialog"
          @canceled="closeCreateVaultDialog"
        />
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import CreateVaultDialog from "@/components/CreateVaultDialog";
import Vaults from "@/components/Vaults";

export default {
  name: "Header",
  components: { CreateVaultDialog, Vaults },
  data() {
    return {
      expand: false,
      showCreateVaultDialog: false,
    };
  },
  computed: {
    showHeaderFullScreen() {
      return this.expand && !this.settingsSelected;
    },
    mainVault() {
      return this.$store.getters["user/mainVault"];
    },
    settingsSelected() {
      return this.$route.path === "/settings";
    },
    title() {
      return this.mainVault
        ? this.$store.getters["vault/name"]
        : "Please create a vault to start";
    },
    firstVault() {
      return this.mainVault ? false : true;
    },
  },
  watch: {
    showHeaderFullScreen(v) {
      if (v) this.expand = true;
      v ? this.$emit("fullscreen", true) : this.$emit("fullscreen", false);
    },
  },
  async created() {
    if (this.mainVault !== "" && this.mainVault !== undefined) {
      await this.$store.dispatch("vault/set", this.mainVault);
    } else {
      this.showCreateVaultDialog = true;
    }
  },
  methods: {
    closeCreateVaultDialog() {
      this.showCreateVaultDialog = false;
      this.displayCreateFirstVault = false;
    },
    closeDialog() {
      this.showCreateVaultDialog = false;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  padding-top: 5px;
  padding-bottom: 5px;
}
.minimized {
  height: 45px;
}
.titleWrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
