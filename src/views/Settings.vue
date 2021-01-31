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
      try {
        const categories = await ApiService.get("categories");
        console.log(categories);
      } catch (error) {
        console.log(error.message);
      }
    },
  },
};
</script>

<style scoped></style>
