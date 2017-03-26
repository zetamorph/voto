import Vue from 'vue';
import VueRouter from 'vue-router';
import store from './store';

// Import components for routing
import PollList from './components/Poll_List.vue';
import Poll from './components/Poll.vue';
import Login from "./components/Login.vue";
import Signup from "./components/Signup.vue";
import NewPoll from "./components/New_Poll.vue";

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  base: '/',
  routes: [
    { path: "/", component: PollList },
    { path: "/login", name: "login", component: Login },
    { path: "/signup", name: "signup", component: Signup },
    { path: "/polls/:id", name: 'poll', component: Poll },
    { path: "/new", name: "new", component: NewPoll }
  ]
});

router.afterEach((to,from) => {
  store.commit("setError", "");
});

export default router;