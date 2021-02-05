<template>
  <div>
    <v-progress-circular
      v-if="creatingVault"
      :size="100"
      color="primary"
      indeterminate
    />

    <v-card class="mx-auto my-4 pa-4 rounded-lg primary" dark outlined>
      Hey
      <span class="font-weight-bold">{{
        this.$store.getters["user/name"]
      }}</span>
      👋, it seems that you start are just start using budgets! Nice 👍! Please
      create your first own vault, where you can collect all your expenses. Or
      ask a friend to add you to their vault to have a shared vault.
    </v-card>

    <form v-if="!creatingVault" @keyup.enter="submit">
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

      <v-btn class="mb-6" rounded x-large color="primary" @click="submit">
        Create vault
      </v-btn>
    </form>
  </div>
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
  data() {
    return {
      name: "",
      creatingVault: false,
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
          this.creatingVault = true;

          const vault = await VaultService.api.create(this.name);
          await UserService.setMainVault(vault._id);

          await this.$store.dispatch("vault/set", vault._id);
          await this.$store.dispatch("user/setMainVault", vault._id);

          this.creatingVault = false;
          this.$emit("created", true);
        }
      } catch (err) {
        console.log(err);
      }
    },
    clear() {
      this.name = "";
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
