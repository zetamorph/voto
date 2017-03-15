<template lang="pug">
div
  nav.nav
    .nav-left
      router-link.nav-item(:to="{ path: '/' }")
        h1.title Voto
    .nav-center
      router-link.nav-item(:to="{path: '/'}") Current Polls
      router-link.nav-item(:to="{path: '/login'}") Log In
    .nav-right

        

  router-view

</template>

<script>

export default {

}

</script>

<style lang="scss">

@import "./../sass/bulma.sass";

</style>