import Vue from 'vue';
import PollViewer from './poll_viewer.vue';

new Vue({
  el: '#app',
  render(createElement) {
    return createElement(PollViewer);
  }
})