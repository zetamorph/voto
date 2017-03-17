<template lang="pug">

div
  section.hero
    .hero-body
      .container.has-text-centered
        h1.title.is-1 {{ poll.title }}
        h2.subtitle {{ poll.description }}
  section.section
    .columns
      .column
        pie-chart(v-bind:poll="poll")
      .column
        option-list(v-bind:poll-data="poll" v-on:addOption="addOption")

</template>

<script>

import axios from 'axios';
import PieChart from './charts/pieChart.js';
import OptionList from './Option_list.vue';

export default {
  data () {
    return {
      poll : {
        options: []
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
    },
    addOption: function () {
      this.getPollData();
    }
  },
  components: {
    PieChart,
    OptionList
  }
}

</script>

<style>
  ul: {
    list-style:none;
  }

  .poll-title {
    margin-bottom: 5vh;
  }
</style>