<template>
	<CrudList
		:fields="fields"
		:records="records"
		@modify="modify($event)"
		@create="create"
		@remove="remove($event)"
	>
		<span slot="titleText">Configure Templates</span>
		<span slot="noResultsText">No templates</span>
		<span slot="createButtonText">Create Template</span>
	</CrudList>
</template>

<script>

	import fields from './TemplateCommon'

	export default {
		computed: {
			fields() 	{ return fields                        	},
			records()	{ return this.$store.get.site.templates	},
		},
		methods: {
			modify(templateId) {
				this.$router.push({ name: 'TemplateEdit', params: { templateId }})
			},
			create() {
				this.$router.push({ name: 'TemplateCreate' })
			},
			remove(templateId) {
				alert('TODO')
			},
		},
	}

</script>

