/* eslint-disable no-param-reassign */

import Vue from "vue";
import Vuex from "vuex";
import VuexPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {
      id: "",
      token: "",
      pollsVotedOn: [],
    },
    error: "",
  },
  mutations: {
    setUser(state, userData) {
      state.user.token = userData.token;
      state.user.id = userData.id;
      state.user.pollsVotedOn = userData.pollsVotedOn;
    },
    deleteUser(state) {
      state.user.token = "";
      state.user.id = "";
    },
    newVote(state, payload) {
      state.user.pollsVotedOn.push(payload.pollId);
    },
    setError(state, error) {
      state.error = error;
    },
  },
  plugins: [VuexPersistedState()],
});
