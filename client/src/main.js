import axios from "axios";
import Vue from "vue";
import VueAxios from "vue-axios";
import router from "./router";
import store from "./store";

// Import App.vue since the Vue instance has to render it
import App from "./App";

Vue.config.productionTip = false;

Vue.router = router;

Vue.use(VueAxios, axios);

const vm = new Vue({
  el: "#app",
  router,
  store,
  template: "<App/>",
  components: { App },
});

Vue.axios.interceptors.request.use((request) => {
  request.headers.Auth = store.state.user.token;
  return Promise.resolve(request);
}, (err) => {
  Promise.reject(err);
});

export default vm;
