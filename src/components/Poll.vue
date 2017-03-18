<template lang="pug">

div
  section.hero.is-bold
    .hero-body
      .container.has-text-centered
        h1.title.is-1 {{ poll.title }}
        h2.subtitle {{ poll.description }}
  section.hero.is-warning(v-if="noVotes")
    .hero-body
      .container.has-text-centered
        .h4.title No one voted on this poll yet!
  section.section 
    .columns
      .column.is-one-third(v-if="!noVotes")
        pie-chart(:chart-data="chartData")
      .column.box(v-if="!userHasVoted")
        .container.has-text-centered
          h4.title Vote on an existing option
        .container 
          ul
            li(v-for="option in options")
              .field
                p.control
                  button.button.outlined(@click="voteOnOption(option.id)") {{ option.title }} : {{ option.voteCount }} Votes
        .container.has-text-centered
          h4.title Or add a new option
          form(@submit.prevent="addOption")
            .field
              p.control
                input.input(v-model="newOption")
              p.control
                button.button.is-primary(type="submit") Vote!
      .column.box(v-else)
        h4 You have already voted

</template>

<script>

import axios from 'axios';
import PieChart from './charts/pieChart.js';

export default {
  data () {
    return {
      poll : {
        id: "",
        title: "",
        description: "",
        userId: ""
      },
      options: [],
      newOption: "",
      userHasVoted: false
    }
  },
  watch: {
    '$route' : function(to, from) {
      if(to.params.id !== from.params.id) {
        this.getPollData();
        this.makeChartData();
      }
    }
  },
  beforeMount () {

    this.getPollData();
    
    // Check if the user has voted on this poll already
    this.checkIfVoted();

  },
  methods: {

    getPollData: function () {
      let self = this;
      axios.all([
        axios.get("http://localhost:8000/polls/" + this.$route.params.id),
        axios.get("http://localhost:8000/polls/" + this.$route.params.id + "/options")
        ]).then(axios.spread((poll, options) => {
          self.poll.id = poll.data.id;
          self.poll.title = poll.data.title;
          self.poll.userId = poll.data.userId;
          self.options = [];
          for(var i=0; i<options.data.length; i++) {
            self.options.push(options.data[i]);
          }
      }), (error) => {
        if(error) console.log(error);
      });
    },

    checkIfVoted: function() {
      let self = this;
      axios.get("http://localhost:8000/polls/" + this.$route.params.id + "/votes/users/" + this.$store.state.user.id).then((response) => {
        if(response.data.hasVoted) self.userHasVoted = true;
        else self.userHasVoted = false;        
      });  
    },

    voteOnOption: function (optionId) {
      let self = this;
      axios.post("/polls/" + this.poll.id + "/vote", {optionId: optionId}).then((response) => {
        self.getPollData();
        self.userHasVoted = true;
      });
    },

    addOption: function () {
      let self = this;
      axios.post("/polls/"+this.poll.id+"/options", {title: this.newOption}).then((response) => {
        return axios.post("/polls/" + self.poll.id + "/vote", {optionId: response.data.id})
      }).then((response) => {
        self.getPollData();
        self.userHasVoted = true;
      });
    },

    makeColorString: function() {
      return "rgba(" + this.makeRandomColor() + "," + this.makeRandomColor() + "," + this.makeRandomColor() + ",1)";
    },

    makeRandomColor: function() {
      return Math.floor(Math.random()*255);
    }
  },
  computed: {
    noVotes: function() {
      if(this.options.length > 0) return false;
      return true;
    },
    chartData: function() {
      let dataObj = {
        labels: [],
        datasets: [{
          data: [],
          backgroundColor: [],
          borderColor: []
        }]
      };
      for(var i=0; i<this.options.length; i++) {
        dataObj.labels[i] = this.options[i].title;
        dataObj.datasets[0].data[i] = this.options[i].voteCount;
        let colorString = this.makeColorString();
        dataObj.datasets[0].backgroundColor[i] = colorString;
        dataObj.datasets[0].borderColor[i] = "rgba(255,255,255,0)";
      }
      return dataObj;
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

  .poll-title {
    margin-bottom: 5vh;
  }
</style>