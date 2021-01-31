<template>
  <div>
    <h1>This is Settings</h1>
    <br />
    <v-container>
      <Logout />
      <br />
      <v-btn class="mt-12" @click="test()">
        tesst
      </v-btn>
      <v-text-field v-model="vaultName">
        hallo
      </v-text-field>
      {{ vaultName }}
    </v-container>
  </div>
</template>

<script>
import Logout from "@/components/Logout";
import { ApiService } from "@/services/api.service.js";

export default {
  name: "Settings",
  components: { Logout },
  data() {
    return {
      vaultName: "",
    };
  },
  methods: {
    async test() {
      try {
        const vault = await ApiService.post("vaults", {
          name: this.vaultName,
        });

        console.log(vault);
      } catch (error) {
        console.log(error.message);
      }
    },
  },
};
</script>

<style scoped></style>
