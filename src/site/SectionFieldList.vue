<template>
	<CrudList
		:fields="fields"
		:records="records"
		@modify="modify($event)"
		@create="create"
		@remove="remove($event)"
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
			fields() 	{ return fields                                       	},
			section()	{ return this.$store.get.site.sections[this.sectionId]	},
			records()	{ return this.section ? this.section.fields : {}      	},
		},
		methods: {
			modify(fieldId) {
				this.$router.push({ name: 'SectionFieldEdit', params: { sectionId, fieldId }})
			},
			create() {
				this.$router.push({ name: 'SectionFieldCreate', params: { sectionId } })
			},
			remove(fieldId) {
				alert('TODO')
			},
		},
	}

</script>

