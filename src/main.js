// init firebase
import firebase from './firebase-integration'
window.firebase = firebase
window.fireDB = firebase.database()

// include vue
import Vue from 'vue'

// include lodash
import lodash from 'lodash'
window._ = lodash

// include vue component library
import Vuetify from 'vuetify'
Vue.use(Vuetify)

// patched vuetify v-dialog
//import VuetifyDialogFixed from './components/v-dialog-fixed'
//Vue.component('v-dialog-fixed', VuetifyDialogFixed)

// include vue-router
import VueRouter from 'vue-router'
Vue.use(VueRouter)

// include vuefire
import VueFire from './vuefire-custom'
Vue.use(VueFire)

// vuex store
import store from './store'

// global components

import MyDataTable from './components/MyDataTable.vue'
Vue.component('my-data-table', MyDataTable)

import BasicDialog from './components/BasicDialog.vue'
Vue.component('basic-dialog', BasicDialog)

// include App, and all the route components
import App         from './App.vue'
import Dashboard   from './Dashboard.vue'
import ListRecords from './ListRecords.vue'
import EditRecord  from './EditRecord.vue'

// configure router
const router = new VueRouter({
	mode: 'history',
	routes: [
		{
			path:      '/', 
			redirect:  to => {
				console.log('redirecting / to /dashboard')
				return '/dashboard'
			},
		},
		{
			path:      '/dashboard', 
			component: Dashboard,
		},
		{
			path:      '/content/:sectionId/list', 
			component: ListRecords,
			props:     true,
		},
		{
			path:      '/content/:sectionId/edit/:recordId', 
			component: EditRecord,
			props:     true,
		},
		{
			path:      '/content/:sectionId/create', 
			component: EditRecord,
			props:     true,
		},
		{
			path:      '/content/:sectionId/edit', // single record section
			component: EditRecord,
			props:     true,
		},
	],
})

// init vue with router config on App
window.root = new Vue({
	store,
	router,
	el: '#app',
	render: h => h(App)
})
