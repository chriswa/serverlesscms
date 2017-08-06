import FirebaseRefManager from './util/FirebaseRefManager'
const firebaseRefManager = new FirebaseRefManager()

firebase.auth().onAuthStateChanged( user => {
	store.dispatch('site/onAuthChange', user)
})

const accountModule = {
	namespaced: true,
	state: {
		ready:       	false,
		readyStatus: 	undefined,
		errorMessage:	undefined,
		uid:         	undefined,
		email:       	undefined,
		userData:    	undefined,
	},
	getters: {
		isLoggedIn(state, getters, rootState, rootGetters) {
			//console.log('store getter running: account.isLoggedIn')
			return !!(state.ready && state.uid)
		},
		isNewUser(state, getters, rootState, rootGetters) {
			//console.log('store getter running: account.isNewUser')
			return !!(state.ready && state.uid && _.isEmpty(state.userData))
		},
	},
	mutations: {
		start(state, readyStatus) {
			state.ready       	= false
			state.readyStatus 	= readyStatus
			state.errorMessage	= undefined
			state.uid         	= undefined
			state.email       	= undefined
			state.userData    	= undefined
		},
		fail(state, error) {
			state.ready       	= true
			state.readyStatus 	= undefined
			state.errorMessage	= error.message
		},
		logout(state) {
			state.ready      	= true
			state.readyStatus	= undefined
			state.uid        	= undefined
			state.email      	= undefined
			state.userData   	= undefined
		},
		login(state, { firebaseUser, userData }) {
			state.ready      	= true
			state.readyStatus	= undefined
			state.uid        	= firebaseUser.uid
			state.email      	= firebaseUser.email
			state.userData   	= userData
		},
	},
	actions: {
		signIn({ commit, dispatch, state, rootState }, { email, password }) {
			return new Promise((resolve, reject) => {
				commit('start', "Logging in")
				firebase.auth().signInWithEmailAndPassword(email, password).then(() => {
					resolve()
				}).catch(error => { // error.code, error.message
					commit('fail', error)
					reject(error)
				})
			})
		},
		register({ commit, dispatch, state, rootState }, { email, password }) {
			return new Promise((resolve, reject) => {
				commit('start', "Signing up")
				firebase.auth().createUserWithEmailAndPassword(email, password).then(() => {
					resolve()
				}).catch(error => { // error.code, error.message
					commit('fail', error)
					reject(error)
				})
			})
		},
		onAuthChange({ commit, dispatch, state, rootState }, firebaseUser) {
			return new Promise((resolve, reject) => {

				// remove any firebase subscriptions from old auth
				firebaseRefManager.removeAll()

				if (!firebaseUser) { // not logged in?
					commit('logout')
					return resolve()
				}

				commit('start', "Loading your account")

				firebaseRefManager.add(
					fireDB.ref(`/users/${firebaseUser.uid}`),
					'value',
					snapshot => {
						var userData = snapshot.val()
						commit('login', { firebaseUser, userData })
						resolve()
					}
				)
			})
		},
	},
}



const siteModule = {
	namespaced: true,
	state: {
		ready:    	false,
		loaded:   	false,
		siteId:   	undefined,
		sections: 	undefined,
		pages:    	undefined,
		templates:	undefined,
		meta:     	undefined,
	},
	getters: {
		loaded(state, getters, rootState, rootGetters) {
			//console.log('store getter running: site.loaded')
			return state.sections !== undefined
		},
	},
	mutations: {
		clearSiteData(state) {
			state.ready    	= true
			state.siteId   	= undefined
			state.sections 	= undefined
			state.pages    	= undefined
			state.templates	= undefined
			state.meta     	= undefined
		},
		startLoading(state, siteId) {
			state.ready 	= false
			state.siteId	= siteId
		},
		setSiteDataKey(state, { siteKey, data }) {
			state[siteKey] = data
		},
		finishLoading(state) {
			state.ready	= true
		},
	},
	actions: {
		onAuthChange({ commit, dispatch, state, rootState }, firebaseUser) {
			return new Promise((resolveTop, rejectTop) => {
				
				// first, run accountModule's onAuthChange action...
				dispatch('account/onAuthChange', firebaseUser, { root: true }).then(() => {
					
					var siteId = rootState.account.userData ? rootState.account.userData.site : undefined
					if (siteId) {
					
						commit('startLoading', siteId)

						var siteKeysToLoad = [ 'sections', 'pages', 'templates', 'meta' ]

						var siteKeyPromises = _.map(siteKeysToLoad, siteKey => {
							return new Promise((resolve, reject) => {
								firebaseRefManager.add(
									fireDB.ref(`/sites/${siteId}/${siteKey}`),
									'value',
									snapshot => {
										// n.b. this will continue to be called as changes are made
										var data = snapshot.val() || {}
										commit('setSiteDataKey', { siteKey, data })
										resolve()
									}
								)
							})
						})

						Promise.all(siteKeyPromises).then( () => {
							commit('finishLoading')
							resolveTop()
						})

					}
					else {
						commit('clearSiteData')
						resolveTop()
					}
				})

			})
		},
	},
}



const editPreviewModule = {
	namespaced: true,
	state: {
		ready:    	false,
		type:     	undefined, // 'Record' or 'Template', etc
		sectionId:	undefined, // only for (type === 'Record') n.b. unused for (type === 'Section')!
		editId:   	undefined,
		record:   	{},
	},
	//getters: {
	//	readyId(state, getters, rootState, rootGetters) {
	//		if (state.ready) {
	//			return state
	//		}
	//		else {
	//			return {}
	//		}
	//	},
	//},
	mutations: {
		clear(state) {
			state.ready    	= false
			state.type     	= undefined
			state.sectionId	= undefined
			state.editId   	= undefined
			state.record   	= undefined
		},
		assign(state, newState) {
			state.ready    	= true
			state.type     	= newState.type
			state.sectionId	= newState.sectionId // optional (only used for (type === 'Record'))
			state.editId   	= newState.editId
			state.record   	= _.cloneDeep(newState.record)
		},
		update(state, { fieldId, newValue }) {
			Vue.set(state.record, fieldId, newValue)
		},
	},
}



const store = new Vuex.Store({
	strict: process.env.NODE_ENV !== 'production',
	modules: {
		account:    	accountModule,
		site:       	siteModule,
		editPreview:	editPreviewModule,
	},
	state: { // this.$store.state.stateKey
		//count: 0,
	},
	getters: { // this.$store.getters.getterName
		//countPlusOne(state, rootState) {
		//	return state.count + 1
		//},
	},
	mutations: { // this.$store.commit('mutationName')
		//increment(state, payload) {
		//	state.count += 1
		//},
	},
	actions: { // this.$store.dispatch('actionName') // promises: https://vuex.vuejs.org/en/actions.html#composing-actions
		//incrementSoon({ commit, dispatch, state, rootState }, payload) {
		//	return new Promise((resolve, reject) => {
		//		setTimeout(() => {
		//			commit('increment')
		//			resolve()
		//		}, 1000)
		//	})
		//},
	},
})

store.get = Object.create(store.state)
_(store.getters)
.keys()
.map(qualifiedGetterName => {
	var parts = qualifiedGetterName.split('/')
	var getterId = parts.pop()
	var moduleId = parts.pop()
	return { moduleId, getterId }
})
.groupBy('moduleId')
.mapValues(v => _.map(v, 'getterId'))
.each((getterIds, moduleId) => {
	var api = store.get
	var getterPrefix = ''
	if (moduleId !== 'undefined') {
		getterPrefix = moduleId + '/'
		Object.defineProperty(api, moduleId, { value: Object.create(store.state[moduleId]) })
		api = api[moduleId]
	}
	_.each(getterIds, getterId => {
		var qualifiedGetterName = getterPrefix + getterId
		var getter = Object.getOwnPropertyDescriptor(store.getters, qualifiedGetterName)
		Object.defineProperty(api, getterId, { get: getter.get })
	})
})

export default store
