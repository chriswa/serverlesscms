<template>
	<CrudList
		:fields="fields"
		:records="records"
		@modify="modify($event)"
		@create="create"
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
		methods: {
			modify(pageId) {
				this.$router.push({ name: 'PageEdit', params: { pageId }})
			},
			create() {
				this.$router.push({ name: 'PageCreate' })
			},
		},
	}

</script>

