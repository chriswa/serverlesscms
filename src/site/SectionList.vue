<template>
	<CrudList
		:fields="fields"
		:records="records"
		@modify="modify($event)"
		@create="create"
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
		methods: {
			modify(sectionId) {
				this.$router.push({ name: 'SectionEdit', params: { sectionId }})
			},
			create() {
				this.$router.push({ name: 'SectionCreate' })
			},
		},
	}

</script>

