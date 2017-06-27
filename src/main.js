import Help from './helper.js';
import Vue from 'vue';
import VueBus from 'vue-bus';
import VueRouter from 'vue-router';
import VueForm from 'vue-form';
import Vue2Filters from 'vue2-filters'
import App from './App.vue';

Vue.use(VueBus);
Vue.use(VueRouter);
Vue.use(VueForm);
Vue.use(Vue2Filters)

new Vue({
  el: '#app',
  filters: {
    json (value) { return JSON.stringify(value, null, 2) }
  },
  render: h => h(App)
});