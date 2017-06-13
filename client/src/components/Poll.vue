<template lang="pug">

div
  .notification.box.is-success.has-text-centered(v-if="userHasVoted")
    h4.title You have already voted
  .notification.box.has-text-centered(v-if="!userLoggedIn")
    h4.title You have to log in to vote
  section.hero.is-bold
    .hero-body
      .container.has-text-centered
        h1.title.is-1 {{ poll.title }}
        h2.subtitle {{ poll.description }}
        h3.subtitle(v-if="userOwnsPoll") by you
        h3.subtitle(v-else="userOwnsPoll") by {{poll.user.username}}
  section.section 
    .columns
      .column.is-1
      #pie-chart-container.column.is-4
        pie-chart(:chart-obj="chartData")
      .column.is-2
      .column.box.is-4
        section
          .notification.box.has-text-centered(v-if="!userHasVoted && userLoggedIn")
            h4.title Vote on an existing option
          .notification.box(v-for="option, key in options")
            .columns
              .column.has-text-centered
                span {{option.title}}
              .column.has-text-centered
                span {{option.votes}}
              .column(v-if="!userHasVoted && userLoggedIn")
                button.button(@click="voteOnOption(option.id)") Vote
        section(v-if="!userHasVoted && userLoggedIn")
          .notification.box.has-text-centered
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

import axios from "axios";
import PieChart from "./charts/pieChart";

export default {
  data() {
    return {
      poll: {
        id: "",
        title: "",
        description: "",
        createdAt: "",
        user: {
          id: "",
          username: "",
        },
      },
      options: [],
      userHasVoted: false,
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
  watch: {
    $route(to, from) {
      if (to.params.id !== from.params.id) {
        this.getPollData();
        this.makeChartData();
      }
    },
  },
  beforeMount() {
    this.getPollData();
  },
  methods: {
    getPollData() {
      const self = this;
      const pollId = this.$route.params.id;
      axios.get(`http://localhost:8000/polls/${pollId}`)
      .then((poll) => {
        self.poll.id = poll.data.id;
        self.poll.title = poll.data.title;
        self.poll.user.id = poll.data.user.id;
        self.poll.user.username = poll.data.user.username;
        self.options = poll.data.options;
        self.votes = poll.data.votes;
      })
      .catch((err) => {
        throw new Error(err);
      });
    },
    voteOnOption(optionId) {
      const self = this;
      axios.post(`http://localhost:8000/options/${optionId}/votes`)
      .then(() => {
        self.getPollData();
        self.userHasVoted = true;
      })
      .catch(() => {
        this.$store.commit("setError", "You have already voted");
      });
    },
    addOption() {
      const self = this;
      const newOption = this.$refs.optionInput.value;
      axios.post(`http://localhost:8000/polls/${this.poll.id}/options`, { title: newOption })
      .then((response) => {
        axios.post(`http://localhost:8000/options/${response.data.id}/votes`);
      })
      .then(() => {
        self.getPollData();
        self.userHasVoted = true;
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
    userLoggedIn() {
      if (!this.$store.state.user.id) return false;
      return true;
    },
    userOwnsPoll() {
      if (!this.$store.state.user.id) return false;
      return this.poll.user.id === this.$store.state.user.id;
    },
  },
  components: {
    PieChart,
  },
};

</script>

<style>
  ul {
    list-style:none;
  }

  .poll-title {
    margin-bottom: 5vh;
  }
</style>
