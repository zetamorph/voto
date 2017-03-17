<template lang="pug">

.columns
  .column
  .column
    h4 Sign Up to vote on polls and share your opinion with others
    form(@submit.prevent="onSubmit")
      .field
        label.label E-Mail
        p.control
          input.input(type="email" v-model="email")
      .field
        label.label Password
        p.control
          input.input(type="password" v-model="password")
      .field
        label.label Confirm Password
        p.control
          input.input(type="password" v-model="confirmPassword")
      .field
        p.control
          button.button.is-primary(type="submit") Sign Up
  .column

</template>

<script>

import axios from 'axios';

export default {
  data () {
    return {
      email: "",
      password: "",
      confirmPassword: ""
    }
  },
  methods: {
    onSubmit: function () {
      
      //check that password matches confirmPassword
      

      axios.post("/users/signup", {email:this.email, password: this.password}).then((response) => {
        this.$router.push('login');
      }, (error) => {
        return Promise.reject(error);
      });
    }
  }

  


}

</script>

<style scoped>
</style>