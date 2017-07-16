// init firebase
import firebase from './firebase-integration'
window.firebase = firebase
window.fireDB = firebase.database()

// include lodash
import lodash from 'lodash'
window._ = lodash

// include vue and friends
import Vue from 'vue'
Vue.use(require('vuetify'))
Vue.use(require('vue-router'))
//Vue.use(require('vuex')) // already called by script tag include
Vue.use(require('./vuefire-custom'))
require('./components') // load global vue components

// configure vuex
import store from './store'
window.store = store // for testing

// configure vue-router
const router = new VueRouter({
	mode:  	'history',
	routes:	require('./routes'),
})

// init vue with router config on App
window.root = new Vue({
	store,
	router,
	el: '#app',
	render: h => h(require('./App.vue'))
})
