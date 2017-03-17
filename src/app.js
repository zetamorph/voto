import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import axios from 'axios';
import VueAxios from 'vue-axios';

Vue.use(VueRouter);
Vue.use(Vuex)
Vue.use(VueAxios, axios);

import PollList from './components/Poll_List.vue';
import Poll from './components/Poll.vue';
import App from './components/App.vue';
import Login from "./components/Login.vue";
import Signup from "./components/Signup.vue";

const router = new VueRouter({
  mode: 'history',
  base: '/',
  routes: [
    { path: "/", component: PollList },
    { path: "/login", name: "login", component: Login },
    { path: "/signup", name: "signup", component: Signup },
    { path: "/polls/:id", name: 'poll', component: Poll }
  ]
});

const store = new Vuex.Store({
  state: {
    user: {
      id: "",
      token: ""
    }
  },
  mutations: {
    setUser: function (state, userData) {
      state.user.token = userData.token;
      state.user.id = userData.id;
    }
  }
});

new Vue({
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