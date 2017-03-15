<template lang="pug">

  div.box
    ul
      li.box(v-for="poll in polls" class="is-unselectable")
        router-link(:to="{name: 'poll', params: { id : poll.id }}") {{ poll.title }} 
        
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