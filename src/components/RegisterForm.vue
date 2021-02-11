<template>
  <div>
    <form @keyup.enter="submit">
      <v-text-field
        v-model="name"
        :error-messages="nameErrors"
        label="Name"
        :counter="30"
        required
        rounded
        outlined
        clearable
        prepend-inner-icon="mdi-account-circle"
        @input="$v.name.$touch()"
        @blur="$v.name.$touch()"
      />
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
        :counter="30"
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
        :loading="registering"
        @click="submit"
      >
        Register
      </v-btn>

      <br />
      <v-container>
        {{ this.$store.getters["auth/authenticationError"] }}
      </v-container>
    </form>
  </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import {
  required,
  minLength,
  maxLength,
  email,
} from "vuelidate/lib/validators";

export default {
  name: "Register",
  mixins: [validationMixin],
  validations: {
    name: { required, minLength: minLength(3), maxLength: maxLength(30) },
    email: { required, email },
    password: { required, minLength: minLength(8), maxLength: maxLength(30) },
  },
  data: () => ({
    name: "",
    registering: false,
    password: "",
    email: "",
  }),
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
    passwordErrors() {
      const errors = [];
      if (!this.$v.password.$dirty) return errors;
      !this.$v.password.maxLength &&
        errors.push("Password must be at most 30 characters long");
      !this.$v.password.minLength &&
        errors.push("Password must be at least 8 characters long");
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
  created() {},
  methods: {
    async submit() {
      try {
        this.$v.$touch();

        if (
          this.passwordErrors.length === 0 &&
          this.emailErrors.length === 0 &&
          this.nameErrors.length === 0 &&
          this.email !== "" &&
          this.name !== "" &&
          this.password !== ""
        ) {
          this.registering = true;

          await this.$store.dispatch("auth/register", {
            name: this.name,
            email: this.email.toLowerCase(),
            password: this.password,
          });

          this.registering = false;

          this.$emit("registered", this.name);
        }
      } catch (err) {
        console.log(err);
        this.registering = false;
      }
    },
    clear() {
      this.$v.$reset();
      this.password = "";
      this.email = "";
      this.name = "";
    },
  },
};
</script>
