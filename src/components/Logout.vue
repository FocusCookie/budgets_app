<template>
  <v-btn rounded x-large color="error" outlined @click="logout">
    Logout
  </v-btn>
</template>

<script>
export default {
  name: "Logout",
  data: () => ({}),
  methods: {
    async logout() {
      try {
        await this.$store.dispatch("auth/logout");
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>
