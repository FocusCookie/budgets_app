<template>
  <div class="vaultsWrapper text-left">
    <v-card
      class="mx-auto my-4 pa-4 rounded-lg"
      :color="selected ? 'primary' : ''"
      :dark="selected"
      :disabled="selected"
      :outlined="selected"
      :loading="loading"
      @click="setToMainVault"
    >
      <div class="d-flex justify-space-between align-center">
        <span :class="`text-h6 ${selected ? '' : 'primary--text'}`">{{
          vault.name.toUpperCase()
        }}</span>

        <v-chip
          :class="selected ? 'primary--text' : ''"
          :color="selected ? 'white' : 'primary'"
          label
        >
          <v-icon left>
            mdi-account-circle-outline
          </v-icon>
          {{ vault.owner.name }}
        </v-chip>
      </div>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "VaultCard",
  validations: {},
  props: ["vault"],
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    selected() {
      return this.$store.getters["vault/id"] === this.vault._id;
    },
  },
  watch: {},
  created() {},
  methods: {
    async setToMainVault() {
      this.loading = true;
      await this.$store.dispatch("vault/set", this.vault._id);
      await this.$store.dispatch("user/setMainVault", this.vault._id);

      this.loading = false;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.vaultsWrapper {
  height: inherit;
}
</style>
