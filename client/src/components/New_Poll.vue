<template lang="pug">

.container
  section.hero.is-bold
    .hero-body
      .container.has-text-centered
        h1.title(v-if="!pollCreated") Create a new Poll!
        h1.title(v-else) Now add up to 5 initial options!
  .columns
    .column
    .column
      .container(v-if="!pollCreated")
        form(@submit.prevent="createPoll")
          .field
            label.label Title
            p.control
              input.input(type="text" v-model="pollData.title")
          .field
            label.label
            p.control
              button.button.is-primary(type="submit") Create Poll
      .container(v-else)
        ul 
          li(v-for="option in options") {{option}}
        form(@submit.prevent="addOption")
          .field
            label.label New Option 
            p.control
              input.input(v-model="newOption")
          .field
            label.label
            p.control
              button.button.is-primary(type="submit") Add Option
              button.button.is-warning
                router-link(:to="{name: 'poll', params: {id: pollData.newId}}") That`s enough

          
    .column


</template>

<script>

import axios from "axios";

export default {
  data() {
    return {
      pollData: {
        newId: "",
        title: "",
      },
      options: [],
      newOption: "",
    };
  },
  watch: {
    hasFiveOptions() {
      if (this.hasFiveOptions) {
        this.$router.push({ name: "poll", params: { id: this.pollData.newId } });
      }
    },
  },
  methods: {
    createPoll() {
      const self = this;
      axios.post("http://localhost:8000/polls", {
        title: this.pollData.title,
      })
      .then((response) => {
        console.log(response.data);
        self.pollData.newId = response.data.id;
      });
    },
    addOption() {
      const self = this;
      axios.post(`http://localhost:8000/polls/${this.pollData.newId}/options`, { title: this.newOption })
      .then((response) => {
        self.options.push(response.data.title);
        self.newOption = "";
      });
    },
  },
  computed: {
    pollCreated() {
      return this.pollData.newId !== "";
    },
    hasFiveOptions() {
      return this.options.length >= 5;
    },
  },
};

</script>

<style>
</style>
