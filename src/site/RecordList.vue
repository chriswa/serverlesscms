<template>
	<div>
		<ContentCard :title="section.name">
			<CrudList
				v-if="loaded"
				:fields="fields"
				:records="records"
				@modify="modify($event)"
				@create="create"
				@remove="remove($event)"
				singular="record"
				plural="records"
			>
			</CrudList>

			<basic-dialog v-model="showingDeleteConfirm" title="Delete Record?" cls="error" yes="Yes" no="No" @yes="removeConfirmed" v-if="loaded">
				<p>Are you sure you want to delete the record "{{ records[doomedId] ? records[doomedId][ this.section.titleField ] : '' }}"?</p>
			</basic-dialog>
		</ContentCard>

		<LoadingIndicator v-if="!loaded"></LoadingIndicator>

	</div>
</template>

<script>

	import FirebaseRefManager from '../util/FirebaseRefManager'

	export default {
		props: [ "sectionId" ],
		data() {
			return {
				loaded:              	false,
				records:             	undefined,
				showingDeleteConfirm:	false,
				doomedId:            	undefined,
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
			modify(editId) {
				this.$router.push({ name: 'RecordEdit', params: { sectionId: this.sectionId, editId }})
			},
			create() {
				this.$router.push({ name: 'RecordCreate', params: { sectionId: this.sectionId } })
			},
			remove(editId) {
				this.doomedId            	= editId
				this.showingDeleteConfirm	= true
			},
			removeConfirmed() {
				fireDB.ref(`/sites/${this.$store.get.site.siteId}/records/${this.sectionId}/${this.doomedId}`).remove()
			},
		},
	}

</script>

