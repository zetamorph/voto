<template lang="pug">

  .columns
    .column
      h4 {{ poll.title }}
      pie-chart(v-bind:poll-data="poll")

    .column
      li(v-for="option in poll.options")
        span {{ option.title }} 
        span {{ option.voteCount }} votes 

</template>

<script>

import axios from 'axios';
import PieChart from './charts/pieChart.js';

export default {
  data () {
    return {
      poll : {
        options: [
          {title: "", voteCount: ""}
        ]
      }
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
  },
  components: {
    PieChart
  }
}

</script>

<style>
  ul: {
    list-style:none;
  }
</style>