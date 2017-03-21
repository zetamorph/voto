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
      let query = "";
      if(this.$route.query.user) {
        query = "?user="+this.$route.query.user;
        
      } else if(this.$route.query.sort) {
        query = "?sort=" + this.$route.query.sort;
      }
      axios.get("http://localhost:8000/api/polls/" + query).then(({data : pollsData}) => {
        this.polls = pollsData;
      });
    }
  }
}

</script>

<style>
</style>