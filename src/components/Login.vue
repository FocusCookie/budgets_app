<template>
  <form @keyup.enter="submit">
    <v-text-field
      v-model="email"
      :error-messages="emailErrors"
      label="E-mail"
      required
      rounded
      outlined
      clearable
      prepend-inner-icon="mdi-at"
      @input="$v.email.$touch()"
      @blur="$v.email.$touch()"
    />
    <v-text-field
      v-model="password"
      :error-messages="passwordErrors"
      label="Password"
      required
      rounded
      outlined
      clearable
      type="password"
      prepend-inner-icon="mdi-lock-question"
      @input="$v.password.$touch()"
      @blur="$v.password.$touch()"
    />

    <v-btn
      class="mb-6"
      rounded
      x-large
      color="primary"
      :loading="loadingAuthData"
      @click="submit"
    >
      Login
    </v-btn>

    <br />
    <v-container>
      {{ this.$store.getters["auth/authenticationError"] }}
    </v-container>
  </form>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, email } from "vuelidate/lib/validators";
import { UserService } from "@/services/user.service.js";
import { SellingPointsService } from "@/services/sellingPoints.service.js";

export default {
  name: "Login",
  mixins: [validationMixin],
  validations: {
    email: { required, email },
    password: { required },
  },
  data: () => ({
    loadingAuthData: false,
    password: "",
    email: "",
    createFirstVaultMsg: false,
  }),
  computed: {
    passwordErrors() {
      const errors = [];
      if (!this.$v.password.$dirty) return errors;
      !this.$v.password.required && errors.push("Password is required.");
      return errors;
    },
    emailErrors() {
      const errors = [];
      if (!this.$v.email.$dirty) return errors;
      !this.$v.email.email && errors.push("Must be valid e-mail");
      !this.$v.email.required && errors.push("E-mail is required");
      return errors;
    },
  },
  async created() {},
  methods: {
    async submit() {
      try {
        this.$v.$touch();

        if (
          this.passwordErrors.length === 0 &&
          this.emailErrors.length === 0 &&
          this.email !== "" &&
          this.password !== ""
        ) {
          this.loadingAuthData = true;

          await this.$store.dispatch("auth/login", {
            email: this.email.toLowerCase(),
            password: this.password,
          });

          //check if mainVault is set
          const mainVault = this.$store.getters["user/mainVault"];

          // if no mainVault is set check if the user has access to other vaults
          if (!mainVault) {
            // check and set  all accessable vaults
            const vaults = await this.$store.dispatch("vault/setAllVaults");

            // if the user has access to vaults set the mainVault to the first vault
            if (vaults.length > 0) {
              await UserService.api.setMainVault(vaults[0]._id);
            }
          }

          // check and set  all accessable vaults
          await this.$store.dispatch("vault/setAllVaults");

          // push all the users sellingPoints and the sellingPoints where the user has access to form the choosen vault
          const userSellingPoints = await SellingPointsService.api.getAll();
          const vaultSellingPoints = this.$store.getters["vault/sellingPoints"];
          await this.$store.dispatch("sellingPoints/setAll", [
            ...userSellingPoints,
            ...vaultSellingPoints,
          ]);

          // get all categories and set them locally
          await this.$store.dispatch("categories/setAll");

          this.loadingAuthData = false;
        }
      } catch (err) {
        console.log(err);
        this.loadingAuthData = false;
      }
    },
    clear() {
      this.$v.$reset();
      this.password = "";
      this.email = "";
    },
  },
};
</script>
