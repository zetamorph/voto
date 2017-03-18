<template lang="pug">

  div.box
    router-link.box.has-text-centered(:to="{name: 'poll', params: { id : poll.id }}" v-for="poll in polls") 
      h4.title.is-bold.is-primary {{ poll.title }} 
        
</template>

<script>

import axios from 'axios';

export default {
  data () {
    return {
      polls : []
    }
  },
  beforeMount () {
    axios.get("http://localhost:8000/polls").then(({data: pollsData}) => {
      this.polls = pollsData;
    });
  },
  methods: {
    getPopular: function() {

    }
  }
}

</script>

<style>
</style>