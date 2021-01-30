<template>
  <div>
    <h1>This is Settings</h1>
    <br />
    <v-container>
      <Logout />
      <br />
      <v-btn @click="test()">
        tesst
      </v-btn>
    </v-container>
  </div>
</template>

<script>
import Logout from "@/components/Logout";
import { ApiService } from "@/services/api.service.js";

export default {
  name: "Settings",
  components: { Logout },
  methods: {
    async test() {
      const categories = await ApiService.get("categories");
      console.log(categories);
    },
  },
};
</script>

<style scoped></style>
