<template>
	<ContentCard title="Configure Sections">
		<CrudList
			:fields="fields"
			:records="records"
			@modify="modify($event)"
			@create="create"
			@remove="remove($event)"
			singular="section"
			plural="sections"
		>
		</CrudList>

		<basic-dialog v-model="showingDeleteConfirm" title="Delete Section?" cls="error" yes="Yes" no="No" @yes="removeConfirmed">
			<p>Are you sure you want to delete the section "{{ records[doomedId] ? records[doomedId].name : '' }}"?</p>
		</basic-dialog>
	</ContentCard>
</template>

<script>

	import { fields } from './SectionCommon'

	export default {
		data() {
			return {
				showingDeleteConfirm:	false,
				doomedId:            	undefined,
			}
		},
		computed: {
			fields() 	{ return fields                       	},
			records()	{ return this.$store.get.site.sections	},
		},
		methods: {
			modify(editId) {
				this.$router.push({ name: 'SectionEdit', params: { editId }})
			},
			create() {
				this.$router.push({ name: 'SectionCreate' })
			},
			remove(editId) {
				this.doomedId            	= editId
				this.showingDeleteConfirm	= true
			},
			removeConfirmed() {
				fireDB.ref(`/sites/${this.$store.get.site.siteId}/sections/${this.doomedId}`).remove()
			},
		},
	}

</script>

