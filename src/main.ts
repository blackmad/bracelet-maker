import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

import BootstrapVue from 'bootstrap-vue';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
Vue.use(BootstrapVue);

import '@/styles/frontend.css';

import * as firebase from 'firebase';

firebase.initializeApp({
  apiKey: "AIzaSyASmFZMPAuu7z3Ccqwn6mXQ6_R_vgV_3oA",
  authDomain: "bracelet-maker.firebaseapp.com",
  databaseURL: "https://bracelet-maker.firebaseio.com",
  projectId: "bracelet-maker",
  storageBucket: "bracelet-maker.appspot.com",
  messagingSenderId: "1036221861104",
  appId: "1:1036221861104:web:79938a2f497fc7b53f8635",
  measurementId: "G-9TBW87KCEF"
});

const initApp = () => {
  new Vue({
    router,
    store,
    render: (h) => h(App),
    data: {
      auth: {
        user: null,
        email: '',
        password: '',
        message: '',
        userName: '',
        hasErrors: false
      }
    }
  }).$mount('#app');
}

firebase.auth().onAuthStateChanged(user => {
  console.log('user changed', user)
  store.dispatch("fetchUser", user);
  initApp();
});