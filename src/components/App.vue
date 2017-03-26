<template lang="pug">
div
  nav.nav.box
    .nav-left
      router-link.nav-item(:to="{ path: '/' }")
        h1.title Voto
    .nav-center
      router-link.nav-item.is-tab(:to="{path: '/', query: {sort: 'latest'}}") Latest
      router-link.nav-item.is-tab(:to="{path: '/'}") Popular
      router-link.nav-item.is-tab(:to="{path: '/new'}" v-if="isLoggedIn") New Poll
      
    .nav-right(v-if="isLoggedIn")
      router-link.nav-item.is-tab(:to="{path: '/', query: {user: this.$store.state.user.id}}") My Polls
      a.nav-item.is-tab(@click.prevent="logOut") Log Out
    .nav-right(v-else)
      router-link.nav-item.is-tab(:to="{path: '/signup'}") Sign Up
      router-link.nav-item.is-tab(:to="{path: '/login'}") Log In
      
  .notification.box.is-danger.has-text-centered(v-if="error")
    h4.title {{error}} 

  transition(name="fade")
    router-view
  
</template>

<script>

import axios from 'axios';

export default {
  data () {
    return {
    }
  },
  computed: {

    error: function() {
      return this.$store.state.error;
    },
    isLoggedIn: function() {
      if(!this.$store.state.user.id) return false;
      return true;
    }
  },
  methods: {
    logOut: function() {
      axios.delete("/users/login").then((response) => {
        this.$store.commit("deleteUser");
        this.$router.push("/");
      }, (error) => {
        return Promise.reject(error);
      });
    }
  }

}




</script>

<style lang="scss">

@import "./../../node_modules/bulma/bulma";

.fade-enter-active {
  transition: opacity 1s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

</style>