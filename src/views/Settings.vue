<template>
  <div class="py-3">
    <h1>This is Settings</h1>
    <br />
    <v-container>
      <p><span class="title">Name </span>{{ userName }}</p>
      <p><span class="title">Role </span>{{ userRole }}</p>
      <p><span class="title">Main Vault </span>{{ userMainVault }}</p>
      <p><span class="title">User ID </span>{{ userId }}</p>
      <br />
      <Logout />
    </v-container>
  </div>
</template>

<script>
import Logout from "@/components/Logout";

export default {
  name: "Settings",
  components: { Logout },
  data() {
    return {
      vaultName: "",
      checkedUserID: "",
    };
  },
  computed: {
    userName() {
      return this.$store.getters["user/name"];
    },
    userRole() {
      return this.$store.getters["user/role"];
    },
    userMainVault() {
      return this.$store.getters["user/mainVault"];
    },
    userId() {
      return this.$store.getters["user/id"];
    },
  },
  methods: {},
};
</script>

<style scoped></style>
