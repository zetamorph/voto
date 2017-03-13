<style>
</style>

<template>
  <ul>
    <li v-for="poll in polls"> {{poll.title}} </li>
  </ul>
</template>

<script>

  import axios from 'axios';

  export default {
    name: 'PollViewer',
    data: () => ({
      polls: []
    }),
    beforeMount () {
      axios.get("/polls").then(({data: pollData}) => {
        this.polls = pollData;
      });
    }
  };
  </script>