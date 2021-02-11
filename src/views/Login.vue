<template>
  <v-container>
    <div v-if="registered">
      <p class="title">{{ name }} you have been successfully registered 🎉!</p>
      <p>You can now login with your email and password.</p>
    </div>
    <LoginForm />

    <br />

    <RegisterForm @registered="showLoginMsgAfterRegistration" />
  </v-container>
</template>

<script>
import LoginForm from "@/components/LoginForm";
import RegisterForm from "@/components/RegisterForm";

export default {
  name: "Login",
  components: { LoginForm, RegisterForm },
  data() {
    return {
      registered: false,
      name: null,
    };
  },
  created() {},
  methods: {
    showLoginMsgAfterRegistration(name) {
      this.registered = true;
      this.name = name;
    },
  },
};
</script>

<style scoped></style>
