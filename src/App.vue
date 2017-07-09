<template>
	<PinnableNavigationLayout>

		<template slot="toolbar">
			<v-toolbar-title>ServerlessCMS</v-toolbar-title>
		</template>

		<template slot="menu">
			<NavMenuLink v-if="siteLoaded" @click="linkTo('/dashboard')"     icon="mdi-web"                  >{{siteMeta.name}}</NavMenuLink>

			<template v-if="siteLoaded">
				<NavMenuLink v-for="[ sectionId, section ] in sortedSections" :key="sectionId" @click="onSectionClick(sectionId, section)">Section: {{section.name}}</NavMenuLink>
			</template>

			<NavMenuLink v-if="siteLoaded"    @click=""                    icon="settings"                   >Configure Sections</NavMenuLink>
			
			<NavMenuLink v-if="siteLoaded"    @click=""                    icon="mdi-book-open-page-variant" >Templates</NavMenuLink>

			<NavMenuLink v-if="auth.uid"      @click="logout"              icon="exit_to_app"                >Logout ({{auth.email}})</NavMenuLink>

			<NavMenuLink v-if="!auth.uid"     @click=""                    icon="account_box"                >Login</NavMenuLink>
		</template>

		<main>
			<v-container fluid>

				<div v-if="loadingStatus">

				</div>
				<div v-else-if="!auth.uid">

					<Login></Login>

				</div>
				<div v-else-if="!loadingStatus">

					<router-view :auth="auth" :sections="sections" :siteMeta="siteMeta"></router-view>

				</div>

			</v-container>
		</main>
		
		<v-dialog :value="!!loadingStatus" persistent transition="div">
			<v-card>
				<v-card-title class="info white--text">Loading</v-card-title>
				<v-card-text>{{ loadingStatus || "Transitioning" }}...</v-card-text>
			</v-card>
		</v-dialog>
	</PinnableNavigationLayout>
</template>
<script>

	export default {
		data() {
			return {
				loadingStatus: 'Connecting to server',
				auth: {
					uid:      undefined,
					email:    undefined,
					userData: undefined,
				},
				siteLoaded: false,
				sections: undefined,
				siteMeta: undefined,
			}
		},
		mounted() {
			firebase.auth().onAuthStateChanged( this.onAuthStateChanged )
		}, 
		components: {
			Login:                    require('./Login.vue'),
			NavMenuLink:              require('./components/NavMenuLink.vue'),
			PinnableNavigationLayout: require('./components/PinnableNavigationLayout.vue'),
		},
		computed: {
			sortedSections() {
				return _(this.sections).toPairs().sortBy('1.order').value()
			},
		},
		methods: {
			logout() {
				firebase.auth().signOut()
				this.linkTo('/')
			},
			onSectionClick(sectionId, section) {
				if (section.type === 'single') {
					this.linkTo(`/content/${sectionId}/edit`)
				}
				else {
					this.linkTo(`/content/${sectionId}/list`)
				}
			},
			linkTo(url) {
				this.$router.push(url)
				this.isTempNavShown = false
			},
			onAuthStateChanged(user) {
				//console.log(user)

				// not logged in?
				if (!user) {
					this.auth.uid      = undefined
					this.auth.userData = undefined
					this.loadingStatus = undefined
					return
				}

				// logged in...
				this.auth.uid   = user.uid
				this.auth.email = user.email

				this.loadingStatus = 'Loading your data'

				fireDB.ref(`/users/${this.auth.uid}`).on('value', snapshot => {
					
					var userData = snapshot.val()
					//console.log(userData)

					if (userData && userData.site) {
						this.auth.userData = userData

						var sectionsLoaded = false
						var metaLoaded     = false
						var onLoadedOneThing = () => {
							if (sectionsLoaded && metaLoaded) {
								this.siteLoaded    = true
								this.loadingStatus = undefined
							}
						}

						fireDB.ref(`/sites/${userData.site}/sections`).on('value', snapshot => {
							this.sections = snapshot.val()
							sectionsLoaded = true
							onLoadedOneThing()
						})
						fireDB.ref(`/sites/${userData.site}/meta`).on('value', snapshot => {
							this.siteMeta = snapshot.val()
							metaLoaded = true
							onLoadedOneThing()
						})

					}
					else {
						// if there's no user data, assume the user is new
						//console.log('welcome, new user!')
						this.$router.push('/welcome')
						this.loadingStatus = undefined
					}
				})
			},
		},
	}

</script>

