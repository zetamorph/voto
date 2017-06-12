<template lang="pug">

  div.box.poll-list(v-if="polls")
    router-link.box.has-text-centered.poll(:to="{name: 'poll', params: { id : poll.id }}", v-for="poll in polls", :key="poll.id") 
      .columns
        .column.is-two-thirds
          h4.title.is-bold.is-primary {{ poll.title }} 
        .column
          h6.subtitle by {{poll.user.username}}
</template>

<script>

import axios from "axios";

export default {
  data() {
    return {
      polls: [],
    };
  },
  watch: {
    $route(to, from) {
      if (from.query !== to.query) {
        this.getPolls();
      }
    },
  },
  beforeMount() {
    this.getPolls();
  },
  methods: {
    getPolls() {
      axios.get("http://localhost:8000/polls/").then(({ data: pollsData }) => {
        this.polls = pollsData;
      });
    },
  },
};

</script>

<style scoped>

.poll:nth-child(2n) {
  background: WhiteSmoke;
}

</style>
