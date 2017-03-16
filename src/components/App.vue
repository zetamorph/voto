<template lang="pug">
div
  nav.nav.box
    .nav-left
      router-link.nav-item(:to="{ path: '/' }")
        h1.title Voto
    .nav-center
      router-link.nav-item(:to="{path: '/'}") Latest
      router-link.nav-item(:to="{path: '/'}") Popular
      
    .nav-right(v-if="user.isLoggedIn")
      router-link.nav-item(:to="{path: '/'}") My Polls
      router-link.nav-item(:to="{path: '/'}") My Profile
    .nav-right(v-else)
      router-link.nav-item(:to="{path: '/signup'}") Sign Up
      router-link.nav-item(:to="{path: '/login'}") Log In
        
  transition(name="fade")
    router-view
  
</template>

<script>

export default {
  data () {
    return {
      user: {
        isLoggedIn: true,
      }
    }
  } 
}


</script>

<style lang="scss">

@import "./../sass/bulma.sass";

.fade-enter-active {
  transition: opacity 1s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

</style>