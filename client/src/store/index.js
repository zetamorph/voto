import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {
      id: "",
      token: ""
    },
    error: ""
  },
  mutations: {
    setUser: function (state, userData) {
      state.user.token = userData.token;
      state.user.id = userData.id;
    },
    deleteUser: function(state) {
      state.user.token = "";
      state.user.id = "";
    },
    setError: function (state, error) {
      state.error = error;
    }
  },
  plugins: [VuexPersistedState()]
});