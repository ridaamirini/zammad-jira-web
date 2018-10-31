import Vue from 'vue';
import Vuex from 'vuex';
import VuexWebExtensions from 'vuex-webextensions';

import * as getters from './getters';
import mutations from './mutations';
import * as actions from './actions';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
      settings: {
          atlassian: {
              url: '',
              user: '',
              token: ''
          },
          zammad: {
              url: '',
              token: ''
          }
      },
      issueForm: {
          type: null,
          project: null
      }
  },
  getters,
  mutations,
  actions,
  plugins: [
      VuexWebExtensions({
        persistentStates: ['settings', 'issueForm']
    })
  ]
})
