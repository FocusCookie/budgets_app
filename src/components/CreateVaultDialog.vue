<template>
  <v-dialog
    v-model="display"
    content-class="ma-0 px-3 rounded-0"
    fluid
    persistent
    transition="dialog-bottom-transition"
    scrollable
  >
    <v-card class="text-left rounded-xl">
      <v-card-title
        class="headline white--text font-weight-bold text-h6 pa-2 text-uppercase"
      >
        Create your first vault
      </v-card-title>

      <v-card-text class="pt-3 pb-0 px-4">
        <v-card
          v-if="firstVault"
          class="pa-3  rounded-lg primary"
          dark
          outlined
        >
          Hey
          <span class="font-weight-bold">{{
            this.$store.getters["user/name"]
          }}</span>
          👋, it seems that you start are just start using budgets! Nice 👍!
          Please create your first own vault, where you can collect all your
          expenses. Or ask a friend to add you to their vault to have a shared
          vault.
        </v-card>

        <form v-if="!creatingVault" class="mt-4" @keyup.enter="submit">
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
        </form>
      </v-card-text>

      <v-card-actions class="px-4 pb-4">
        <v-btn
          v-if="!firstVault"
          rounded
          color="primary"
          outlined
          @click="cancel"
        >
          Cancel
        </v-btn>

        <v-spacer />

        <v-btn rounded color="primary" @click="submit">
          Create vault
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
  name: "CreateVaultDialog",
  mixins: [validationMixin],
  validations: {
    name: { required, minLength: minLength(3), maxLength: maxLength(30) },
  },
  props: ["display"],
  data() {
    return {
      name: "",
      creatingVault: false,
    };
  },
  computed: {
    firstVault() {
      return this.$store.getters["user/firstTimeUser"];
    },
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
          this.creatingVault = true;

          const vault = await VaultService.api.create(this.name);
          await UserService.api.setMainVault(vault._id);

          await this.$store.dispatch("vault/set", vault._id);
          await this.$store.dispatch("user/setMainVault", vault._id);

          await this.$store.dispatch("vault/setAllVaults");

          this.$store.dispatch("expenses/reset");

          if (this.firstVault) {
            await this.$store.dispatch("user/setFirstTimeUser", false);
          }

          this.creatingVault = false;
          this.name = "";
          this.$emit("created", true);
        }
      } catch (err) {
        console.log(err);
      }
    },
    cancel() {
      this.name = "";
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

.headline {
  background: var(--v-primary-base);
  display: flex;
  justify-content: center;
}
</style>
