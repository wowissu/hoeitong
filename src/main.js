import Help from './helper.js';
import Vue from 'vue';
import VueBus from 'vue-bus';
import VueRouter from 'vue-router';
import VueForm from 'vue-form';
// import Vue2Filters from 'vue2-filters'
import App from './App.vue';
import filter from './filter.js';

Vue.use(VueBus);
Vue.use(VueRouter);
Vue.use(VueForm);


new Vue({
  el: '#app',
  filters: {
    json (value) { return JSON.stringify(value, null, 2) }
  },
  render: h => h(App)
});