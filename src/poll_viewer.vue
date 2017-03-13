<style>
</style>

<template>
  <ul>
    <li v-for="poll in polls"> 
      <p> {{poll.title}} </p>
    </li>
  </ul>
</template>

<script>

  import axios from 'axios';

  export default {
    name: 'PollViewer',
    data: () => ({
      poll: []
    }),
    beforeMount () {
      axios.all(
        ["/polls/1/options/votes",
         "/polls/1"]).then(({data: votes}, {data: poll}) => {
        this.poll = pollData;
      });
    }
  };
  </script>