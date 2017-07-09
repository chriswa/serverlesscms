<template>
	<v-app>
		<v-navigation-drawer temporary light v-model="isTempNavShown" v-if="!isPermanentNavShown">
			<v-list dense>

				<NavMenuLink @click="pin" icon="mdi-pin">Pin this menu</NavMenuLink>

				<slot name="menu"></slot>

			</v-list>
		</v-navigation-drawer>
		<v-navigation-drawer permanent light v-if="isPermanentNavShown" :value="true">
			<v-list dense>

				<NavMenuLink @click="unpin" icon="mdi-pin-off">Unpin this menu</NavMenuLink>

				<slot name="menu"></slot>

			</v-list>
		</v-navigation-drawer>
		<v-toolbar dark fixed>
			<v-toolbar-side-icon light @click.native.stop="isTempNavShown = !isTempNavShown" v-if="!isPermanentNavShown"></v-toolbar-side-icon>

			<slot name="toolbar"></slot>

		</v-toolbar>

		<slot></slot>

	</v-app>
</template>

<script>
	export default {
		data() {
			//console.log(`pinNav == ${localStorage.getItem('pinNav') === 'true'}`)
			return {
				isTempNavShown:      false,
				isPermanentNavShown: localStorage.getItem('pinNav') === 'true',
			}
		},
		components: {
			NavMenuLink: require('./NavMenuLink.vue'),
		},
		watch: {
			isPermanentNavShown(value) {
				//console.log(`watched pinNav get set to ${value}`)
				localStorage.setItem('pinNav', value)
			},
		},
		methods: {
			pin() {
				//console.log('PIN!')
				this.isTempNavShown      = false
				Vue.nextTick(() => {
					alert("FIXME: please reload the page")
					this.isPermanentNavShown = true
				})
			},
			unpin() {
				this.isTempNavShown      = true
				this.isPermanentNavShown = false
			},
		},
	}
</script>
