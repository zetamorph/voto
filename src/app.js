import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuex from 'vuex';

Vue.use(VueRouter);
Vue.use(Vuex)

import PollList from './components/Poll_List.vue';
import Poll from './components/Poll.vue';
import App from './components/App.vue';
import Login from "./components/Login.vue";

const router = new VueRouter({
  mode: 'history',
  base: '/',
  routes: [
    { path: "/", component: PollList },
    { path: "/login", name: "login", component: Login },
    { path: "/polls/:id", name: 'poll', component: Poll }
  ]
});

const store = new Vuex.Store({
  state: {
    user: {}
  },
  mutations: {
    
  }
});

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});