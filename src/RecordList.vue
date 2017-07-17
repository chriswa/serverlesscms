<template>
	<CrudList
		:loaded="loaded"
		:fields="fields"
		:records="records"
		@modify="$router.push(`edit/${$event}`)"
		@delete="alert('todo')"
	>
		<span slot="titleText">{{ section.name }}</span>
		<span slot="noResultsText">No records</span>
		<span slot="createButtonText">Create Record</span>
	</CrudList>
</template>

<script>

	import FirebaseRefManager from './FirebaseRefManager'

	export default {
		props: [ "sectionId" ],
		data() {
			return {
				loaded: 	false,
				records:	undefined,
			}
		},
		computed: {
			site()   	{ return this.$store.get.site              	},
			section()	{ return this.site.sections[this.sectionId]	},
			fields() 	{ return this.section.fields               	},
		},
		mounted() {
			this.firebaseRefManager = new FirebaseRefManager()
			this.init()
		},
		beforeDestroy() {
			this.firebaseRefManager.removeAll()
		},
		watch: {
			$route(to, from) {
				this.firebaseRefManager.removeAll()
				this.init()
			},
		},
		methods: {
			init() {
				this.loaded = false
				this.firebaseRefManager.add(fireDB.ref(`/sites/${this.site.siteId}/records/${this.sectionId}`).limitToFirst(100), 'value', snapshot => {
					this.records = snapshot.val()
					this.loaded = true
				})
			},
		},
	}

</script>

