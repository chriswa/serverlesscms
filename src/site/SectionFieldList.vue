<template>
	<CrudList
		:fields="fields"
		:records="records"
		@modify="$router.push(`edit/${$event}`)"
		@delete="alert('todo')"
	>
		<span slot="noResultsText">No fields</span>
		<span slot="createButtonText">Create Field</span>
	</CrudList>
</template>

<script>

	import fields from './SectionFieldCommon'

	export default {
		props: [ "sectionId" ],
		computed: {
			fields() {
				return fields
			},
			section() {
				return this.$store.get.site.sections[this.sectionId]
			},
			records() {
				return this.section ? this.section.fields : {}
			},
		},
	}

</script>

