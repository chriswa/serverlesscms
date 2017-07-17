<template>
	<CrudList
		:fields="fields"
		:records="records"
		@modify="$router.push(`edit/${$event}`)"
		@delete="alert('todo')"
	>
		<span slot="titleText">Configure Sections</span>
		<span slot="noResultsText">No sections</span>
		<span slot="createButtonText">Create Section</span>
	</CrudList>
</template>

<script>

	import fields from './SectionCommon'

	export default {
		computed: {
			fields() {
				return fields
			},
			records() {
				return this.$store.get.site.sections
			},
		},
	}

</script>

