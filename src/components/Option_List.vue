<template lang="pug">
section.section.box
  .container.has-text-centered
    h4.title Vote on an existing option
  .container
    ul
      li(v-for="option in poll.options")
        button.button.outlined
          router-link(:to="{path: '/'}") {{option.title}}
  .container.has-text-centered
    h4.title Or add a new option
    form(@submit.prevent="addOption")
      .field
        p.control
          input.input(v-model="newOption")
        p.control
          button.button.is-primary(type="submit") Vote!
    
</template>

<script>

  import axios from 'axios';

  export default {
    data: function () {
      return {
        poll: {},
        newOption: ""
      }
    },
    props: {
      pollData: {
        type: Object
      }
    },
    watch: {
      pollData: function() {
        this.poll = this.pollData;
      }
    },
    methods: {
      addOption: function () {
        let self = this;
        axios.post("/polls/"+this.poll.id+"/options", {title: this.newOption}).then(function (response) {
          self.$emit('addOption');
        }, function (err) {
          return Promise.reject(err);
        });
      }
    }
  }

</script>

