<template lang="pug">

.box
  h4.title.has-text-centered
    strong All Polls
  div.poll-list(v-if="polls")
    router-link.box.has-text-centered.poll(:to="{name: 'poll', params: { id : poll.id }}", v-for="poll in polls", :key="poll.id") 
      poll-list-item(:poll-id="poll.id")
      
</template>

<script>

import axios from "axios";
import pollListItem from "./Poll_List_Item";

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
  components: {
    pollListItem,
  },
};

</script>

<style scoped>

.poll:nth-child(2n) {
  background: WhiteSmoke;
}

</style>
