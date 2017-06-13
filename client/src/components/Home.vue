<template lang="pug">

.home
  .column.is-one-third.is-pulled-left
    featured-poll.box.has-text-centered
  .column.is-two-thirds.is-pulled-right
    poll-list

</template>


<script>

import FeaturedPoll from "@/components/Featured_Poll";
import PollList from "@/components/Poll_List";

export default {
  data() {
    return {

    };
  },
  components: {
    FeaturedPoll,
    PollList,
  },
};

</script>

