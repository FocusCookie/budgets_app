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
          @click="expand = !expand"
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

    <CreateVaultDialog
      :display="showCreateVaultDialog || firstVault"
      @created="closeCreateVaultDialog"
      @canceled="closeCreateVaultDialog"
    />
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
      return this.$store.getters["user/firstTimeUser"];
    },
  },
  watch: {
    showHeaderFullScreen(v) {
      if (v) this.expand = true;
      v ? this.$emit("fullscreen", true) : this.$emit("fullscreen", false);
    },
  },
  async created() {
    if (this.firstVault) {
      this.showCreateVaultDialog = true;
    } else {
      await this.$store.dispatch("vault/set", this.mainVault);
    }
  },
  methods: {
    closeCreateVaultDialog() {
      this.showCreateVaultDialog = false;
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
