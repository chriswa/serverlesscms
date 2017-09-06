<template>
	<ContentCard :title="'Configure Sections &mdash; ' + (recordWip.name || '(untitled)')">
		
		<CrudEdit
			:fields="fields"
			:record="recordWip"
			@fieldUpdate="onFieldUpdate"
		>
			<div slot="buttons">
				<v-btn :disabled="isUnchanged" @click.native.stop="save">{{ isNewRecord ? 'Create' : 'Update' }}</v-btn>
				<v-btn :disabled="false"       @click.native.stop="gotoListPage">Cancel</v-btn>
			</div>
		</CrudEdit>
	
		<SectionFieldList
			v-if="!isNewRecord"
			:sectionId="editId"
		>
			<span slot="titleText">
				Fields
			</span>
		</SectionFieldList>

	</ContentCard>
</template>

<script>

	import Crud from '../crud/Crud'
	import { fields } from './schema/SectionSchema'

	export default {
		props: [ "editId" ],
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
			fields()      	{ return fields                                                        	},
			site()        	{ return this.$store.get.site                                          	},
			isNewRecord() 	{ return !this.editId                                                  	},
			isUnchanged() 	{ return _.isEqual(this.recordSource, this.recordWip)                  	},
			recordSource()	{ return this.site.sections[this.editId] || Crud.newRecord(this.fields)	},
		},
		methods: {
			init() {
				this.recordWip = _.clone(this.recordSource)
				this.$store.commit('editPreview/assign', {
					type:  	'Section',
					editId:	this.editId,
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
					fireDB.ref(`/sites/${this.site.siteId}/sections/${this.editId}`).update(objectToSave)
				}
				this.init()
			},
		},
	}

</script>

