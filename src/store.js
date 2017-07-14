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
			console.log('store getter running: account.isLoggedIn')
			return !!(state.ready && state.uid)
		},
		isNewUser(state, getters, rootState, rootGetters) {
			console.log('store getter running: account.isNewUser')
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

				if (!firebaseUser) { // not logged in?
					commit('logout')
					return resolve()
				}

				commit('start', "Loading your account")

				fireDB.ref(`/users/${firebaseUser.uid}`).on('value', snapshot => { // TODO: unregister this firebase event handler next time authChange runs?
					var userData = snapshot.val()
					commit('login', { firebaseUser, userData })
					resolve()
				})
			})
		},
	},
}

const siteModule = {
	namespaced: true,
	state: {
		ready:   	false,
		loaded:  	false,
		siteId:  	undefined,
		sections:	undefined,
		meta:    	undefined,
	},
	getters: {
		loaded(state, getters, rootState, rootGetters) {
			console.log('store getter running: site.loaded')
			return state.sections !== undefined
		},
	},
	mutations: {
		startLoading(state) {
			state.ready   	= false
			state.siteId  	= undefined
			state.sections	= undefined
			state.meta    	= undefined
		},
		setSiteData(state, { siteId, section, meta }) {
			state.ready   	= true
			state.siteId  	= siteId
			state.sections	= section
			state.meta    	= meta
		},
	},
	actions: {
		onAuthChange({ commit, dispatch, state, rootState }, firebaseUser) {
			return new Promise((resolveTop, rejectTop) => {
				
				// first, run accountModule's onAuthChange action...
				dispatch('account/onAuthChange', firebaseUser, { root: true }).then(() => {
					
					var siteId = rootState.account.userData ? rootState.account.userData.site : undefined
					if (siteId) {
					
						commit('startLoading')

						var sectionPromise = new Promise((resolve, reject) => {
							fireDB.ref(`/sites/${siteId}/sections`).on('value', snapshot => {
								resolve(snapshot.val())
							})
						})
	
						var metaPromise = new Promise((resolve, reject) => {
							fireDB.ref(`/sites/${rootState.account.userData.site}/meta`).on('value', snapshot => {
								resolve(snapshot.val())
							})
						})
	
						Promise.all([sectionPromise, metaPromise]).then(([section, meta]) => {
							commit('setSiteData', { siteId, section, meta })
							resolveTop()
						})

					}
					else {
						commit('setSiteData', {})
						resolveTop()
					}
				})

			})
		},
	},
}

const store = new Vuex.Store({
	strict: process.env.NODE_ENV !== 'production',
	modules: {
		account:	accountModule,
		site:   	siteModule,
	},
	state: { // this.$store.state.stateKey
		count: 0,
	},
	getters: { // this.$store.getters.getterName
		countPlusOne(state, rootState) {
			return state.count + 1
		},
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

store.get = function(moduleId, keyId) {
	// support calling without a moduleId; i.e. store.get(keyId) should result in store.get(undefined, keyId)
	if (keyId === undefined) {
		keyId   	= moduleId
		moduleId	= undefined
	}

	// first, check the state to see if the requested key is available there...
	var state = moduleId ? store.state[moduleId] : store.state
	if (state.hasOwnProperty(keyId)) {
		return state[keyId]
	}

	// if not, next check the getters...
	var qualifiedGetter = (moduleId ? moduleId + '/' : '') + keyId
	if (store.getters.hasOwnProperty(qualifiedGetter)) {
		return store.getters[qualifiedGetter]
	}

	// 
	return undefined
}

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
