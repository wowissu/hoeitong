// Require Froala Editor js file.
require('froala-editor/js/froala_editor.pkgd.min.js');
//
// Require Froala Editor css files.
// require('froala-editor/css/froala_editor.pkgd.min.css');
/* eslint-disable import/first */
// require('font-awesome/css/font-awesome.css');
// require('froala-editor/css/froala_style.min.css');

// import $ from "jquery";
import './helper.js';
import './filter.js';
import Vue from 'vue';
import VueBus from 'vue-bus';
import VueRouter from 'vue-router';
// import VueFroala from 'vue-froala-wysiwyg'
import VueForm from 'vue-form';
import App from './App.vue';
import $ from 'jquery';
import 'font-awesome/css/font-awesome.css'

// Import and use Vue Froala lib.
// Vue.use(VueFroala);
Vue.use(VueBus);
Vue.use(VueRouter);
Vue.use(VueForm);

window.$ = $;

new Vue({
  el: '#app',
  filters: {
    json (value) { return JSON.stringify(value, null, 2) }
  },
  render: h => h(App)
});