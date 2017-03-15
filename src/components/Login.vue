<template lang="pug">

  .columns
    .column
    .column
      label.label Username
      p.control
        input.input(type="text" placeholder="Username")
      label.label Password
      p.control
        input.input(type="password")
      p.control
        button.button.is-primary Log In
    .column

</template>

<script>

  export default {
    data () {
      return {

      }
    }
  }

</script>

<style scoped>
</style>