<template>
	<AppLayout :allowPreview="isSiteLoaded">

		<template slot="previewContent">
			<Preview></Preview>
		</template>

		<template slot="menu">

			<template v-if="isSiteLoaded">

				<v-divider :inset="false"></v-divider>

				<!--<NavMenuLink @click="linkTo('/preview')"	icon="mdi-eye"         	>Preview</NavMenuLink>-->
				<NavMenuLink @click="linkTo('/publish')"    	icon="mdi-cloud-upload"	>Publish</NavMenuLink>

				<v-divider :inset="false"></v-divider>
				
				<template>
					<NavMenuLink v-for="[ sectionId, section ] in sortedSections" :key="sectionId" @click="linkTo(sectionContentLink(sectionId))">{{ section.name }}</NavMenuLink>
				</template>

				<v-divider :inset="false"></v-divider>

				<NavMenuLink @click="linkTo('/sections/')" 	icon="mdi-database"         	>Configure Sections</NavMenuLink>
				<NavMenuLink @click="linkTo('/pages/')"    	icon="mdi-sitemap"          	>Configure Pages</NavMenuLink>
				<NavMenuLink @click="linkTo('/templates/')"	icon="mdi-format-align-left"	>Configure Templates</NavMenuLink>
				<NavMenuLink @click="linkTo('/settings')"  	icon="settings"             	>Configure Settings</NavMenuLink>

			</template>

			<v-divider :inset="false"></v-divider>
			
			<!--<NavMenuLink v-if="isLoggedIn"	@click="linkTo('/my-account')"	icon="account_box"	>My Account</NavMenuLink>-->
			<NavMenuLink v-if="isLoggedIn"    	@click="logout"               	icon="exit_to_app"	>Logout ({{ account.email }})</NavMenuLink>
			<NavMenuLink v-if="!isLoggedIn"   	@click=""                     	icon="account_box"	>Login</NavMenuLink>

		</template>

		<template slot="main">

			<div v-if="!ready">

			</div>
			<div v-else-if="!isLoggedIn">

				<Login></Login>

			</div>
			<div v-else>

				<router-view :key="$route.fullPath"></router-view>

			</div>

		</template>
		
		<v-dialog :value="!ready" persistent transition="div">
			<v-card>
				<v-card-title class="info white--text">Loading</v-card-title>
				<v-card-text v-if=     	"!account.ready"	>{{ account.readyStatus }}...</v-card-text>
				<v-card-text v-else-if=	"!site.ready"   	>Loading your data...</v-card-text>
				<v-card-text v-else    	                	>Transitioning...</v-card-text>
			</v-card>
		</v-dialog>

	</AppLayout>
</template>
<script>

	export default {
		data() {
			return {
			}
		},
		components: {
			Login:    	require('./Login.vue'),
			AppLayout:	require('../gui/AppLayout.vue'),
			Preview:  	require('./Preview.vue'),
		},
		computed: {
			account()       	{ return this.$store.get.account                                  	},
			site()          	{ return this.$store.get.site                                     	},
			ready()         	{ return this.account.ready && this.site.ready                    	},
			isLoggedIn()    	{ return this.$store.get.account.isLoggedIn                       	},
			isSiteLoaded()  	{ return this.$store.get.site.loaded                              	},
			sortedSections()	{ return _(this.site.sections).toPairs().sortBy('1.order').value()	},
		},
		methods: {
			sectionContentLink(sectionId) {
				return this.site.sections[sectionId].type === 'single' ? `/record/${sectionId}/edit` : `/record/${sectionId}/`
			},
			logout() {
				firebase.auth().signOut()
				this.linkTo('/')
			},
			linkTo(url) {
				this.$router.push(url)
				this.isTempNavShown = false
			},
		},
	}

</script>

