<template>
  <v-dialog v-model="display" style="margin:0; padding:0;">
    <v-card v-click-outside="cancel" class="text-left rounded-xl ma-0">
      <v-card-title
        class="headline white--text font-weight-bold text-h6 pa-2 text-uppercase"
      >
        EDIT {{ vault.name }}
      </v-card-title>
      <v-card-text class="px-3 pt-6 pb-0 body-1">
        <div v-if="deleteRequirementsMsg">
          <p class="font-weight-bold">🚨 Deleting {{ vault.name }}</p>
          <p>
            To delete the vault, please type in
            <span class="font-weight-bold error--text">{{ vault.name }} </span
            >and click delete.
          </p>
        </div>

        <v-progress-circular
          v-if="editingVault"
          :size="100"
          color="primary"
          indeterminate
        />

        <form v-if="!editingVault" class="pa-0" @keyup.enter="submit">
          <v-text-field
            v-model="name"
            :error-messages="nameErrors"
            label="Name"
            class="ma-0 py-0"
            :counter="30"
            required
            rounded
            outlined
            clearable
            prepend-inner-icon="mdi-safe"
            @input="$v.name.$touch()"
            @blur="$v.name.$touch()"
          />
        </form>
      </v-card-text>

      <v-card-actions class="pa-4 d-flex justify-space-between">
        <v-btn rounded color="primary" outlined text @click="cancel">
          Cancel
        </v-btn>

        <v-btn rounded color="secondary" text @click="deleteVault">
          Delete
        </v-btn>

        <v-btn rounded color="primary" @click="submit">
          save vault
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
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
      display: true,
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
  created() {
    this.name = this.vault.name;
  },
  methods: {
    async submit() {
      try {
        this.$v.$touch();

        if (this.nameErrors.length === 0 && this.name !== this.vault.name) {
          this.editingVault = true;

          const editedVault = await VaultService.api.edit(
            this.vault._id,
            this.name,
          );

          await this.$store.dispatch("vault/set", editedVault._id);

          await this.$store.dispatch("vault/setAllVaults");

          this.editingVault = false;
          this.$emit("changed", true);
        } else {
          this.$emit("changed", "Name was not changed no API Call");
        }
      } catch (err) {
        console.log(err);
      }
    },
    async deleteVault() {
      if (this.name === this.vault.name) {
        const mainVault = this.$store.getters["user/mainVault"];

        await VaultService.api.delete(this.vault._id);

        // check if the deleted vault was the main vault, if so check if there other vault where the user has access to and set the first as main vault
        if (this.vault._id === mainVault) {
          await this.$store.dispatch("user/setMainVault", "");
          await UserService.api.resetMainVault();
          await this.$store.dispatch("vault/reset");
          await this.$store.dispatch("sellingPoints/reset");
          await this.$store.dispatch("expenses/reset");
        }

        const vaultWithAccessTo = await this.$store.dispatch(
          "vault/setAllVaults",
        );

        if (vaultWithAccessTo.length > 0) {
          await UserService.api.setMainVault(vaultWithAccessTo[0]._id);
          await this.$store.dispatch("vault/set", vaultWithAccessTo[0]._id);
          await this.$store.dispatch(
            "user/setMainVault",
            vaultWithAccessTo[0]._id,
          );
          // set the sellingPoints (combined from vault and user)
          await this.$store.dispatch("sellingPoints/setAll");

          this.$store.dispatch("expenses/reset");

          // load all expenses from the mainVault
          await this.$store.dispatch("expenses/currentMonth");
        } else {
          await this.$store.dispatch("user/setFirstTimeUser", true);
        }

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
.wrapper {
  display: flex;
  flex-direction: column;
}
.headline {
  background: var(--v-primary-base);
  display: flex;
  justify-content: center;
}
.v-dialog.v-dialog--active {
  margin: 0;
}
</style>
