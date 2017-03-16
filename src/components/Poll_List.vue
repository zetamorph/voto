<template lang="pug">

  div.box
    router-link.box(:to="{name: 'poll', params: { id : poll.id }}" v-for="poll in polls") {{ poll.title }} 
        
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