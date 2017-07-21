<template>
	<CrudList
		:fields="fields"
		:records="records"
		@modify="$router.push(`edit/${$event}`)"
		@delete="alert('todo')"
	>
		<span slot="titleText">Configure Pages</span>
		<span slot="noResultsText">No pages</span>
		<span slot="createButtonText">Create Page</span>
	</CrudList>
</template>

<script>

	import fields from './PageCommon'

	export default {
		computed: {
			fields() {
				return fields
			},
			records() {
				return this.$store.get.site.pages
			},
		},
	}

</script>

