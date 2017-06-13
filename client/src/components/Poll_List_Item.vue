<template lang="pug">

.columns
  .column.is-two-thirds
    h4.title.is-bold.is-primary {{ pollData.title }} 
  .column
    h6.subtitle {{ pollData.totalVotes }} Votes
  .column
    h6.subtitle by {{ pollData.user }}

</template>

<script>

import axios from "axios";

export default {
  props: ["pollId"],
  data() {
    return {
      pollData: {
        title: "",
        user: "",
        totalVotes: "",
      },
    };
  },
  beforeMount() {
    this.getPollData();
  },
  methods: {
    getPollData() {
      const self = this;
      axios.get(`http://localhost:8000/polls/${this.pollId}`)
      .then((poll) => {
        self.pollData.title = poll.data.title;
        self.pollData.user = poll.data.user.username;
        self.pollData.totalVotes = poll.data.options
        .map(el => el.votes)
        .reduce((acc, val) => acc + val, 0);
      })
      .catch((err) => {
        throw new Error(err);
      });
    },
  },
};

</script>

