import Vue from 'vue';
import router from './router';
import store from './store';
import axios from 'axios';
import VueAxios from 'vue-axios';


// Import App.vue since the Vue instance has to render it 
import App from './components/App.vue';

Vue.router = router;

Vue.use(VueAxios, axios);

var vm = new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});

Vue.axios.interceptors.request.use(function (request) {
  request.headers.Auth = store.state.user.token;
  return Promise.resolve(request);
}, function (err) {
  return Promise.reject(error);
});