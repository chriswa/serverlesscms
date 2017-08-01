<template>
	<div>
		
		<CrudEdit
			:fields="fields"
			:record="recordScratch"
			@fieldUpdate="onFieldUpdate"
		>
			<span slot="titleText">
				Configure Sections &mdash; {{ recordScratch.name || '(untitled)' }}
			</span>
			<div slot="buttons">
				<v-btn :disabled="isUnchanged" @click.native.stop="save">{{ isNewRecord ? 'Create' : 'Update' }}</v-btn>
				<v-btn :disabled="false"       @click.native.stop="gotoListPage">Cancel</v-btn>
			</div>
		</CrudEdit>
	
		<SectionFieldList
			v-if="!isNewRecord"
			:sectionId="sectionId"
		>
			<span slot="titleText">
				Fields
			</span>
		</SectionFieldList>

	</div>
</template>

<script>

	import fields from './SectionCommon'

	export default {
		props: [ "sectionId" ],
		components: {
			"SectionFieldList": require('./SectionFieldList.vue'),
		},
		data() {
			return {
				recordScratch:	{},
			}
		},
		mounted() {
			this.init()
		},
		computed: {
			fields()      	{ return fields                                          	},
			site()        	{ return this.$store.get.site                            	},
			isNewRecord() 	{ return !this.sectionId                                 	},
			isUnchanged() 	{ return _.isEqual(this.recordSource, this.recordScratch)	},
			recordSource()	{ return this.site.sections[this.sectionId] || {}        	},
		},
		methods: {
			init() {
				this.recordScratch = _.clone(this.recordSource)
			},
			gotoListPage() {
				this.$router.push(`/sections`)
			},
			onFieldUpdate(fieldId, newValue) {
				Vue.set(this.recordScratch, fieldId, newValue)
			},
			save() {
				if (this.isNewRecord) {
					var newRecordId = fireDB.ref(`/sites/${this.site.siteId}/sections`).push(this.recordScratch)
				}
				else {
					var objectToSave = _.clone(this.recordScratch)
					fireDB.ref(`/sites/${this.site.siteId}/sections/${this.sectionId}`).update(objectToSave)
				}
				this.init()
			},
		},
	}

</script>

