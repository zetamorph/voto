<template lang="pug">

  .columns
    .column
    .column
      form(@submit.prevent="onSubmit")
        .field
          label.label E-Mail
          p.control
            input.input(v-model="email" type="text" placeholder="Username")
        .field
          label.label Password
          p.control
            input.input(v-model="password" type="password" placeholder="Password")
        .field
          label.label
          p.control
            button.button.is-primary(type="submit") Log In
    .column

</template>

<script>

  import axios from "axios";

  export default {
    data() {
      return {
        email: "",
        password: "",
      };
    },
    methods: {
      onSubmit() {
        axios.post("http://localhost:8000/users/login", this.$data)
        .then((response) => {
          this.$store.commit("setUser", {
            id: response.data.id,
            token: response.headers.auth,
            pollsVotedOn: response.data.pollsVotedOn,
          });
          this.$router.push("/");
        }, (err) => {
          Promise.reject(err);
        });
      },
    },
  };

</script>

<style scoped>
</style>
