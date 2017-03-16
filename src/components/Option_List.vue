<template lang="pug">
section.section.box
  .container.has-text-centered
    h4.title Vote on an existing option
  .container
    ul
      li(v-for="option in optionData")
        button.button.outlined
          router-link(:to="{path: '/'}") {{option.title}}
  .container.has-text-centered
    h4.title Or add a new option
    .field
      p.control
        input.input 
      p.control
        button.button.is-primary Vote!
    
</template>

<script>

  export default {
    data: function () {
      return {
        options: []
      }
    },
    props: {
      optionData: {
        type: Array
      }
    },
    updated: function() {
      this.options = this.optionData;
    }
  }

</script>

