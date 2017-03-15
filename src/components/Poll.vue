<template lang="pug">

  .columns
    .column
      h4 {{ poll.title }}
    .column
      li(v-for="option in poll.options")
        span {{ option.title }} 
        span {{ option.voteCount }} votes 

</template>

<script>

import axios from 'axios';

export default {
  data () {
    return {
      poll : {},
    }
  },
  watch: {
    '$route' : function(to, from) {
      if(to.params.id !== from.params.id) {
        this.getPollData();
      }
    }
  },
  beforeMount () {
    this.getPollData();
  },
  methods: {
    getPollData: function () {
      axios.get("http://localhost:8000/polls/" + this.$route.params.id).then(({data: pollData}) => {
        this.poll = pollData;
      });
    }
  }
}

</script>

<style>
  ul: {
    list-style:none;
  }
</style>