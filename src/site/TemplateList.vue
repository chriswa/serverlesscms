<template>
	<ContentCard title="Configure Templates">
		<CrudList
			:fields="fields"
			:records="records"
			@modify="modify($event)"
			@create="create"
			@remove="remove($event)"
			singular="template"
			plural="templates"
		>
		</CrudList>

		<basic-dialog v-model="showingDeleteConfirm" title="Delete Template?" cls="error" yes="Yes" no="No" @yes="removeConfirmed">
			<p>Are you sure you want to delete the template "{{ records[doomedId] ? records[doomedId].name : '' }}"?</p>
		</basic-dialog>
	</ContentCard>
</template>

<script>

	import { fields } from './TemplateCommon'

	export default {
		data() {
			return {
				showingDeleteConfirm:	false,
				doomedId:            	undefined,
			}
		},
		computed: {
			fields() 	{ return fields                        	},
			records()	{ return this.$store.get.site.templates	},
		},
		methods: {
			modify(editId) {
				this.$router.push({ name: 'TemplateEdit', params: { editId }})
			},
			create() {
				this.$router.push({ name: 'TemplateCreate' })
			},
			remove(editId) {
				this.doomedId            	= editId
				this.showingDeleteConfirm	= true
			},
			removeConfirmed() {
				fireDB.ref(`/sites/${this.$store.get.site.siteId}/templates/${this.doomedId}`).remove()
			},
		},
	}

</script>

