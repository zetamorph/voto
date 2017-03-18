<template lang="pug">

section.section
  .container.has-text-centered
    h1.title Create a new Poll and add up to 5 initial options
  .container
    form(@submit.prevent="createPoll")
      .field
        label.label Title
        p.control
          input.input(type="text" v-model="pollData.title")
      .field
        label.label Description
        p.control
          input.input(type="text" v-model="pollData.description")
      .field
        p.control
          button.button.is-primary(type="submit") Create Poll


</template>

<script>

import axios from 'axios';

export default {
  data () {
    return {
      pollData: {
        title: "",
        description: ""
      }
    }
  },
  methods: {
    createPoll: function() {
      axios.post("/polls",{
        title: this.pollData.title,
        description: this.pollData.description
      }).then((response) => {
        this.$router.push({name:"poll", params: {id: response.data.id}});
      });
    }
  }
}

</script>

<style>
</style>