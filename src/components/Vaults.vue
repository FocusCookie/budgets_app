<template>
  <div class="vaultsWrapper">
    <VaultCard v-for="vault in vaults" :key="vault._id" :vault="vault" />
  </div>
</template>

<script>
import VaultCard from "@/components/VaultCard";

export default {
  name: "Vaults",
  validations: {},
  components: { VaultCard },
  data() {
    return {};
  },
  computed: {
    vaults() {
      return this.$store.getters["vault/allVaults"];
    },
  },
  created() {},
  methods: {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.vaultsWrapper {
  height: inherit;
}
</style>
