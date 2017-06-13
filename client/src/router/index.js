import Vue from "vue";
import Router from "vue-router";

// Import components for routing
import store from "@/store";
import Home from "@/components/Home";
import Poll from "@/components/Poll";
import Login from "@/components/Login";
import Signup from "@/components/Signup";
import NewPoll from "@/components/New_Poll";

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: "/",
  routes: [
    { path: "/", component: Home },
    { path: "/login", name: "login", component: Login },
    { path: "/signup", name: "signup", component: Signup },
    { path: "/polls/:id", name: "poll", component: Poll },
    { path: "/new", name: "new", component: NewPoll },
  ],
});

router.afterEach(() => {
  store.commit("setError", "");
});

export default router;
