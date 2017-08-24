<template>
	<ContentCard title="Configure Pages">
		<CrudList
			:fields="fields"
			:records="records"
			@modify="modify($event)"
			@create="create"
			@remove="remove($event)"
			singular="page"
			plural="pages"
		>
		</CrudList>

		<basic-dialog v-model="showingDeleteConfirm" title="Delete Page?" cls="error" yes="Yes" no="No" @yes="removeConfirmed">
			<p>Are you sure you want to delete the page "{{ records[doomedId] ? records[doomedId].name : '' }}"?</p>
		</basic-dialog>
	</ContentCard>
</template>

<script>

	import { fields } from './schema/PageSchema'

	export default {
		data() {
			return {
				showingDeleteConfirm:	false,
				doomedId:            	undefined,
			}
		},
		computed: {
			fields() 	{ return fields                    	},
			records()	{ return this.$store.get.site.pages	},
		},
		methods: {
			modify(editId) {
				this.$router.push({ name: 'PageEdit', params: { editId }})
			},
			create() {
				this.$router.push({ name: 'PageCreate' })
			},
			remove(editId) {
				this.doomedId            	= editId
				this.showingDeleteConfirm	= true
			},
			removeConfirmed() {
				fireDB.ref(`/sites/${this.$store.get.site.siteId}/pages/${this.doomedId}`).remove()
			},
		},
	}

</script>

