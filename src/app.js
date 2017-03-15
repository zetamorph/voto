import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

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

new Vue({
  el: '#app',
  router,
  render: h => h(App)
});