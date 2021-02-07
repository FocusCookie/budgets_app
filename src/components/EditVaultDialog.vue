<template>
  <div class="wrapper">
    <span class="text-h6 primary--text font-weight-bold text-uppercase"
      >Edit {{ vault.name }}
    </span>

    <div v-if="deleteRequirementsMsg" class="mt-4">
      <p class="font-weight-bold">🚨 Deleting {{ vault.name }}</p>
      <p>
        To delete the vault, please type in
        <span class="font-weight-bold error--text">{{ vault.name }} </span>and
        click delete.
      </p>
    </div>

    <v-progress-circular
      v-if="editingVault"
      :size="100"
      color="primary"
      indeterminate
    />
    <form v-if="!editingVault" class="mt-4" @keyup.enter="submit">
      <v-text-field
        v-model="name"
        :error-messages="nameErrors"
        label="Name"
        :counter="30"
        required
        rounded
        outlined
        clearable
        prepend-inner-icon="mdi-safe"
        @input="$v.name.$touch()"
        @blur="$v.name.$touch()"
      />

      <div class="buttonsWrapper">
        <v-btn rounded x-large color="secondary" text @click="cancel">
          Cancel
        </v-btn>

        <v-btn rounded x-large color="error" text @click="deleteVault">
          Delete
        </v-btn>

        <v-btn rounded x-large color="primary" @click="submit">
          save vault
        </v-btn>
      </div>
    </form>
  </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, minLength, maxLength } from "vuelidate/lib/validators";
import { VaultService } from "@/services/vault.service.js";
import { UserService } from "@/services/user.service.js";

export default {
  name: "EditVaultDialog",
  mixins: [validationMixin],
  props: ["vault"],
  validations: {
    name: { required, minLength: minLength(3), maxLength: maxLength(30) },
  },
  data() {
    return {
      name: "",
      editingVault: false,
      deleteRequirementsMsg: false,
    };
  },
  computed: {
    nameErrors() {
      const errors = [];
      if (!this.$v.name.$dirty) return errors;
      !this.$v.name.maxLength &&
        errors.push("Name must be at most 30 characters long");
      !this.$v.name.minLength &&
        errors.push("Name must be at least 3 characters long");
      !this.$v.name.required && errors.push("Name is required.");
      return errors;
    },
  },
  created() {},
  methods: {
    async submit() {
      try {
        this.$v.$touch();

        if (this.nameErrors.length === 0 && this.name.length >= 3) {
          this.editingVault = true;

          const editedVault = await VaultService.api.edit(
            this.vault._id,
            this.name,
          );

          await this.$store.dispatch("vault/set", editedVault._id);

          await this.$store.dispatch("vault/setAllVaults");

          this.editingVault = false;
          this.$emit("changed", true);
        }
      } catch (err) {
        console.log(err);
      }
    },
    async deleteVault() {
      if (this.name === this.vault.name) {
        await VaultService.api.delete(this.vault._id);

        const vaultWithAccessTo = await this.$store.dispatch(
          "vault/setAllVaults",
        );

        await UserService.api.setMainVault(vaultWithAccessTo[0]._id);

        await this.$store.dispatch("vault/set", vaultWithAccessTo[0]._id);
        await this.$store.dispatch(
          "user/setMainVault",
          vaultWithAccessTo[0]._id,
        );

        this.$emit("deleted", true);
      } else {
        this.deleteRequirementsMsg = true;
      }
    },
    cancel() {
      this.$emit("canceled", true);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.buttonsWrapper {
  display: flex;
  justify-content: space-between;
}
.wrapper {
  display: flex;
  flex-direction: column;
}
</style>
