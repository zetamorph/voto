<template lang="pug">

  div.box
    router-link.box.has-text-centered(:to="{name: 'poll', params: { id : poll.id }}" v-for="poll in polls") 
      .columns
        .column.is-two-thirds
          h4.title.is-bold.is-primary {{ poll.title }} 
        .column
          h6.subtitle by {{poll.user.username}}
        
</template>

<script>

import axios from 'axios';

export default {
  data () {
    return {
      polls : []
    }
  },
  watch: {
    '$route': function(to,from) {
      if(from.query !== to.query) {
        this.getPolls();
      }
    }
  },
  beforeMount () {
    this.getPolls();
  },
  methods: {
    getPolls: function() {
      if(this.$route.query.user) {
        axios.get("/api/polls/?user="+this.$route.query.user).then(({data : pollsData}) => {
          this.polls = pollsData;
        });
      }
      else {
        axios.get("/api/polls").then(({data: pollsData}) => {
          this.polls = pollsData;
        });
      }
    }
  }
}

</script>

<style>
</style>