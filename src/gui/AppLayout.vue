<template>
	<v-app :style="{ height: 'calc(100vh - 64px)' }">

		<v-navigation-drawer temporary v-model="isTempNavOpen" v-if="!isPermanentNavOpen">
			<v-list dense>
				<NavMenuLink @click="pin" icon="mdi-pin">Pin this menu</NavMenuLink>

				<slot name="menu"></slot>

			</v-list>
		</v-navigation-drawer>
		<v-navigation-drawer permanent v-if="isPermanentNavOpen" :value="true">
			<v-list dense>
				<NavMenuLink @click="unpin" icon="mdi-pin-off">Unpin this menu</NavMenuLink>

				<slot name="menu"></slot>

			</v-list>
		</v-navigation-drawer>

		<PreviewDrawer :width="previewWidth" @setWidth="setPreviewWidth" v-if="isPreviewOpen">
			<template slot="content">
				<slot name="previewContent"></slot>
			</template>
		</PreviewDrawer>

		<v-toolbar dark fixed :style="{ paddingRight: previewWidthPx, transition: 'none' }">

			<v-toolbar-side-icon light @click="toggleTempNav" v-if="!isPermanentNavOpen"></v-toolbar-side-icon>

			<v-toolbar-title>
				ServerlessCMS
				<!-- dev links -->
				<a target="_blank" href="https://console.firebase.google.com/project/serverlesscms/database/data">
					<img src="https://www.gstatic.com/mobilesdk/160503_mobilesdk/logo/2x/firebase_28dp.png" width="32" height="32" style="margin-bottom: -6px; margin-left: 6px;">
				</a>
				<!-- / dev links -->
			</v-toolbar-title>
			
			<v-spacer></v-spacer>

			<v-btn icon @click.native.stop="isPreviewDesiredOpen = !isPreviewDesiredOpen" v-tooltip:left="{ html: isPreviewDesiredOpen ? 'Hide Preview' : 'Preview Site' }" v-if="allowPreview">
				<v-icon medium dark>{{ isPreviewDesiredOpen ? 'mdi-eye-off' : 'mdi-eye' }}</v-icon>
			</v-btn>

		</v-toolbar>

		<main :style="{ marginRight: previewWidthPx, paddingRight: '0', height: 'calc(100vh - 64px)', marginTop: '64px', paddingTop: '0', transition: 'none', overflow: 'auto' }">
			<v-container fluid>
				<slot name="main"></slot>
			</v-container>
		</main>

		<slot></slot>

	</v-app>
</template>

<script>
	export default {
		props: [ 'allowPreview' ],
		data() {
			//console.log(`pinNav == ${localStorage.getItem('pinNav') === 'true'}`)
			return {
				isTempNavOpen:       	false,
				isPermanentNavOpen:  	localStorage.getItem('pinNav') !== 'false',
				isPreviewDesiredOpen:	true,
				previewWidth:         640,
			}
		},
		computed: {
			isPreviewOpen() 	{ return this.allowPreview && this.isPreviewDesiredOpen },
			previewWidthPx()	{ return this.isPreviewOpen ? this.previewWidth + 'px' : '0' },
		},
		components: {
			PreviewDrawer:	require('./PreviewDrawer.vue'),
		},
		watch: {
			isPermanentNavOpen(value) {
				//console.log(`watched pinNav get set to ${value}`)
				localStorage.setItem('pinNav', value)
			},
		},
		methods: {
			toggleTempNav() {
				console.log(`toggleTempNav`)
				this.isTempNavOpen = !this.isTempNavOpen
			},
			pin() {
				//console.log('PIN!')
				this.isTempNavOpen      = false
				Vue.nextTick(() => {
					alert("FIXME: please reload the page")
					this.isPermanentNavOpen = true
				})
			},
			unpin() {
				this.isTempNavOpen      = true
				this.isPermanentNavOpen = false
			},
			setPreviewWidth(previewWidth) {
				this.previewWidth = previewWidth
			},
		},
	}
</script>
