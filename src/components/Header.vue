<template>
  <div class="pt-1">
    <span class="overline primary--text">{{
      settingsSelected ? "Settings" : title
    }}</span>

    <div v-if="!mainVault && !settingsSelected" class="creationWrapper">
      <CreateVaultDialog />
    </div>
  </div>
</template>

<script>
import CreateVaultDialog from "@/components/CreateVaultDialog";

export default {
  name: "Header",
  components: { CreateVaultDialog },
  data() {
    return {
      displayCreateFirstVault: false,
    };
  },
  computed: {
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
  },
  async created() {
    if (this.mainVault !== "" && this.mainVault !== undefined) {
      await this.$store.dispatch("vault/set", this.mainVault);
    } else {
      this.displayCreateFirstVault = true;
    }
  },
  methods: {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.creationWrapper {
  height: 1vh;
}
</style>
