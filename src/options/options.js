import Vue from 'vue'
import App from './App'
import store from '../store';

global.browser = require('webextension-polyfill');

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  render: h => h(App)
});
