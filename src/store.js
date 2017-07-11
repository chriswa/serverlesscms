const accountModule = {
	namespaced: true,
	state: {
		loaded:  	false,
		uid:     	undefined,
		email:   	undefined,
		userData:	undefined,
	},
	getters: {
		isLoggedIn(state, getters, rootState, rootGetters) {
			return state.loaded && state.uid
		},
		isNewUser(state, getters, rootState, rootGetters) {
			return state.loaded && state.uid && _.isEmpty(state.userData)
		},
	},
	mutations: {
		startLoading(state) {
			state.loaded = false
		},
		logout(state) {
			state.loaded  	= true
			state.uid     	= undefined
			state.email   	= undefined
			state.userData	= undefined
		},
		login(state, { firebaseUser, userData }) {
			state.loaded  	= true
			state.uid     	= firebaseUser.uid
			state.email   	= firebaseUser.email
			state.userData	= userData
		},
	},
	actions: {
		onAuthChange({ commit, dispatch, state, rootState }, firebaseUser) {
			return new Promise((resolve, reject) => {

				if (!firebaseUser) { // not logged in?
					commit('logout')
					return resolve()
				}

				commit('startLoading')

				fireDB.ref(`/users/${this.auth.uid}`).on('value', snapshot => { // TODO: unregister this firebase event handler next time authChange runs?
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
		loaded:  	false,
		sections:	undefined,
		meta:    	undefined,
	},
	getters: {
	},
	mutations: {
		startLoading(state) {
			state.loaded = false
		},
		setLoadedData(state, { section, meta }) {
			state.sections	= section
			state.meta    	= meta
		},
	},
	actions: {
		onAuthChange({ commit, dispatch, state, rootState }, firebaseUser) {
			commit('startLoading')
			return new Promise((resolveTop, rejectTop) => {
				
				// first, run accountModule's onAuthChange action...
				dispatch('onAuthChange', 'account', firebaseUser).then(() => {
					
					var sectionPromise = new Promise((resolve, reject) => {
						fireDB.ref(`/sites/${rootState.account.userData.site}/sections`).on('value', snapshot => {
							resolve(snapshot.val())
						})
					})

					var metaPromise = new Promise((resolve, reject) => {
						fireDB.ref(`/sites/${rootState.account.userData.site}/meta`).on('value', snapshot => {
							resolve(snapshot.val())
						})
					})

					Promise.all([sectionPromise, metaPromise]).then(([section, meta]) => {
						commit('setLoadedData', { section, meta })
						resolveTop()
					})
				})

			})
		},
	},
}

const store = new Vuex.Store({
	modules: {
		account:	accountModule,
		site:   	siteModule,
	},
	state: { // this.$store.state.stateKey
		//count: 0,
	},
	getters: { // this.$store.getters.getterName
		//fooLength(state, rootState) {
		//	return state.foo.length
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

export default store
