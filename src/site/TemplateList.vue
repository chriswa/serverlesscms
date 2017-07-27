<template>
	<CrudList
		:fields="fields"
		:records="records"
		@modify="$router.push(`edit/${$event}`)"
		@delete="alert('todo')"
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
			fields() 	{ return fields              	},
			site()   	{ return this.$store.get.site	},
			records()	{ return this.site.templates 	},
		},
	}

</script>

