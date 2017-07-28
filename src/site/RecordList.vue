<template>
	<CrudList
		:loaded="loaded"
		:fields="fields"
		:records="records"
		@modify="modify($event)"
		@create="create"
		@delete="alert('todo')"
	>
		<span slot="titleText">{{ section.name }}</span>
		<span slot="noResultsText">No records</span>
		<span slot="createButtonText">Create Record</span>
	</CrudList>
</template>

<script>

	import FirebaseRefManager from '../util/FirebaseRefManager'

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
			this.loaded = false
			this.firebaseRefManager.add(fireDB.ref(`/sites/${this.site.siteId}/records/${this.sectionId}`).limitToFirst(100), 'value', snapshot => {
				this.records = snapshot.val()
				this.loaded = true
			})
		},
		beforeDestroy() {
			this.firebaseRefManager.removeAll()
		},
		methods: {
			modify(recordId) {
				this.$router.push({ name: 'RecordEdit', params: { sectionId: this.sectionId, recordId }})
			},
			create() {
				this.$router.push({ name: 'RecordCreate', params: { sectionId: this.sectionId } })
			},
		},
	}

</script>

