<template lang="pug">

.columns
  .column
  .column
    .notification.box.has-text-centered
      h4.title Sign up to vote on polls!
    form(@submit.prevent="onSubmit")
      .field
        label.label Username
        p.control
          input.input(type="text" v-model="username" placeholder="Username")
      .field
        label.label E-Mail
        p.control
          input.input(type="email" v-model="email" placeholder="E-Mail")
      .field
        label.label Password
        p.control
          input.input(type="password" v-model="password" placeholder="Password")
      .field
        label.label Confirm Password
        p.control
          input.input(type="password" v-model="confirmPassword" placeholder="Confirm Password")
      .field
        label.label
        p.control
          button.button.is-primary(type="submit") Sign Up
  .column

</template>

<script>

import axios from "axios";

export default {
  data() {
    return {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    };
  },
  methods: {
    onSubmit() {
      if (this.password === this.confirmPassword) {
        axios.post("http:/localhost:8000/users/signup", { username: this.username, email: this.email, password: this.password }).then(() => {
          this.$router.push("login");
        }, (error) => {
          Promise.reject(error);
        });
      } else {
        this.$store.state.error = "The passwords don`t match";
        this.password = "";
        this.confirmPassword = "";
      }
    },
  },
};

</script>

<style scoped>
</style>
