<template lang="pug">

.box
  h4.title 
    strong Featured Poll
  .box.featured-poll.is-flex 
    h4.title {{ poll.title }}
    pie-chart(:chart-obj="chartData")
    .box.total-votes {{ totalVotes }} Votes
    div(v-if="poll.id")
      router-link(:to="{name: 'poll', params: { id : poll.id }}")
        button.button.vote-button.is-success 
          strong Vote!


</template>

<script>

import axios from "axios";
import PieChart from "./charts/pieChart";

export default {
  data() {
    return {
      poll: {
        id: "",
        title: "",
        user: {
          id: "",
          username: "",
        },
      },
      options: [],
      totalVotes: [],
      chartOptions: {
        legend: {
          display: true,
        },
        tooltips: {
          enabled: false,
        },
      },
    };
  },
  beforeMount() {
    this.getPollData();
  },
  methods: {
    getPollData() {
      const self = this;
      const pollId = 2;
      axios.get(`http://localhost:8000/polls/${pollId}`)
      .then((poll) => {
        self.poll.id = poll.data.id;
        self.poll.title = poll.data.title;
        self.poll.user.id = poll.data.user.id;
        self.poll.user.username = poll.data.user.username;
        self.options = poll.data.options;
        self.totalVotes = poll.data.options
        .map(el => el.votes)
        .reduce((acc, val) => acc + val, 0);
      })
      .catch((err) => {
        throw new Error(err);
      });
    },
    makeRGBAString() {
      return `rgba(${this.makeRandomColor()},${this.makeRandomColor()},${this.makeRandomColor()},1`;
    },
    makeRandomColor() {
      return Math.floor(Math.random() * 255);
    },
  },
  computed: {
    chartData() {
      const dataObj = {
        labels: [],
        datasets: [{
          data: [],
          backgroundColor: [],
          borderColor: [],
        }],
      };
      let i;
      for (i = 0; i < this.options.length; i += 1) {
        dataObj.labels[i] = this.options[i].title;
        dataObj.datasets[0].data[i] = this.options[i].votes;
        const colorString = this.makeRGBAString();
        dataObj.datasets[0].backgroundColor[i] = colorString;
        dataObj.datasets[0].borderColor[i] = "rgba(255,255,255,0)";
      }
      return { data: dataObj, options: this.chartOptions };
    },
  },
  components: {
    PieChart,
  },
};

</script>

<style scoped>

.featured-poll {
  justify-content: center;
}

.total-votes {
  
  width: 50%;
  margin: 0 auto;
  margin-top: 2vh;
}

.vote-button {
  margin-top: 2vh;
  width: 50%;
}

</style>
