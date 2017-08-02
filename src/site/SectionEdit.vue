<template>
	<div>
		
		<CrudEdit
			:fields="fields"
			:record="recordWip"
			@fieldUpdate="onFieldUpdate"
		>
			<span slot="titleText">
				Configure Sections &mdash; {{ recordWip.name || '(untitled)' }}
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
				recordWip:	{},
			}
		},
		mounted() {
			this.init()
		},
		beforeDestroy() {
			this.$store.commit('editPreview/clear')
		},
		computed: {
			fields()      	{ return fields                                      	},
			site()        	{ return this.$store.get.site                        	},
			isNewRecord() 	{ return !this.sectionId                             	},
			isUnchanged() 	{ return _.isEqual(this.recordSource, this.recordWip)	},
			recordSource()	{ return this.site.sections[this.sectionId] || {}    	},
		},
		methods: {
			init() {
				this.recordWip = _.clone(this.recordSource)
				this.$store.commit('editPreview/assign', {
					type:  	'Section',
					editId:	this.sectionId,
					record:	this.recordWip,
				})
			},
			gotoListPage() {
				this.$router.push(`/sections`)
			},
			onFieldUpdate(fieldId, newValue) {
				Vue.set(this.recordWip, fieldId, newValue)
				this.$store.commit('editPreview/update', { fieldId, newValue })
			},
			save() {
				if (this.isNewRecord) {
					var newRecordId = fireDB.ref(`/sites/${this.site.siteId}/sections`).push(this.recordWip)
				}
				else {
					var objectToSave = _.clone(this.recordWip)
					fireDB.ref(`/sites/${this.site.siteId}/sections/${this.sectionId}`).update(objectToSave)
				}
				this.init()
			},
		},
	}

</script>

