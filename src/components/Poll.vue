<template lang="pug">

div
  .notification.box.is-warning.has-text-centered(v-if="!pollHasVotes")
    h4.title No one voted on this poll yet!
  .notification.box.is-success.has-text-centered(v-if="userHasVoted")
    h4.title You have already voted
  .notification.box.has-text-centered(v-if="!userLoggedIn")
    h4.title You have to log in to vote
  section.hero.is-bold
    .hero-body
      .container.has-text-centered
        h1.title.is-1 {{ poll.title }}
        h2.subtitle {{ poll.description }}
        h3.subtitle by {{poll.user.username}} on {{pollCreatedAt}}
  section.section 
    .columns
      .column.is-1
      #pie-chart-container.column.is-4
        pie-chart(:chart-obj="chartData")
      .column.is-1
      .column.box.is-4(v-if="!userHasVoted && userLoggedIn")
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
                input.input#new-option(ref="optionInput")
              p.control
                button.button.is-primary(type="submit") Vote!
      .column.is-1

         

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
        userId: "",
        createdAt: "",
        user: {
          username: ""
        }
      },
      options: [],
      userHasVoted: false,
      chartOptions: {
        legend: {
          display: true
        },
        tooltips: {
          enabled: false
        },
      },
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
        axios.get("/api/polls/" + this.$route.params.id),
        axios.get("/api/polls/" + this.$route.params.id + "/options")
        ]).then(axios.spread((poll, options) => {
          self.poll.id = poll.data.id;
          self.poll.title = poll.data.title;
          self.poll.userId = poll.data.user.id;
          self.poll.createdAt = poll.data.createdAt;
          self.poll.user.username = poll.data.user.username;
          self.options = [];
          for(var i=0; i<options.data.length; i++) {
            self.options.push(options.data[i]);
          }
      }), (error) => {
        if(error) console.log(error);
      });
    },

    checkIfVoted: function() {
      if(this.$store.state.user.id) {
        let self = this;
        axios.get("/api/polls/" + this.$route.params.id + "/votes/users/" + this.$store.state.user.id).then((response) => {
          if(response.data.hasVoted) self.userHasVoted = true;
          else self.userHasVoted = false;        
        });  
      }
    },

    voteOnOption: function (optionId) {
      let self = this;
      axios.post("/api/polls/" + this.poll.id + "/votes/" + optionId).then((response) => {
        self.getPollData();
        self.userHasVoted = true;
      });
    },

    // When a user adds an option, a vote on this option is automatically cast

    addOption: function () {
      let self = this;
      let newOption = this.$refs.optionInput.value;
      axios.post("/api/polls/"+this.poll.id+"/options", {title: newOption}).then((response) => {
        return axios.post("/api/polls/" + self.poll.id + "/votes/" + response.data.id)
      }).then((response) => {
        self.getPollData();
        self.userHasVoted = true;
      });
    },

    makeRGBAString: function() {
      return "rgba(" + this.makeRandomColor() + "," + this.makeRandomColor() + "," + this.makeRandomColor() + ",1)";
    },

    makeRandomColor: function() {
      return Math.floor(Math.random()*255);
    }
  },
  computed: {
    pollCreatedAt: function() {
      let date = new Date(this.poll.createdAt);
      return date.getDate() + "/" + String(parseInt(date.getMonth())+1) + "/" + date.getFullYear();
    },
    pollHasVotes: function() {
      if(this.options.length === 0) return false;
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
        let colorString = this.makeRGBAString();
        dataObj.datasets[0].backgroundColor[i] = colorString;
        dataObj.datasets[0].borderColor[i] = "rgba(255,255,255,0)";
      }
      return {data: dataObj, options: this.chartOptions};
    },
    userLoggedIn: function() {
      if(!this.$store.state.user.id) return false;
      return true;
    },
    userOwnsPoll: function() {
      return this.poll.user.id === this.$store.state.user.id;
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