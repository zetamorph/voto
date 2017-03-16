<template lang="pug">

  .columns
    .column
    .column
      .field
        label.label Username
        p.control
          input.input(type="text" placeholder="Username")
      .field
        label.label Password
        p.control
          input.input(type="password")
      .field
        p.control
          button.button.is-primary Log In
    .column

</template>

<script>

  export default {
    data () {
      return {
        user: {

        }
      }
    },
    
  }

</script>

<style scoped>
</style>