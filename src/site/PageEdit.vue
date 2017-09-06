<template>
	<ContentCard :title="'Configure Pages &mdash; ' + (recordWip.name || '(untitled)')">
		
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
	
	</ContentCard>
</template>

<script>

	import Crud from '../crud/Crud'
	import { fields } from './schema/PageSchema'

	export default {
		props: [ "editId" ],
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
			fields()      	{ return fields                                                     	},
			site()        	{ return this.$store.get.site                                       	},
			isNewRecord() 	{ return !this.editId                                               	},
			isUnchanged() 	{ return _.isEqual(this.recordSource, this.recordWip)               	},
			recordSource()	{ return this.site.pages[this.editId] || Crud.newRecord(this.fields)	},
		},
		methods: {
			init() {
				this.recordWip = _.clone(this.recordSource)
				this.$store.commit('editPreview/assign', {
					type:  	'Page',
					editId:	this.editId,
					record:	this.recordWip,
				})
			},
			gotoListPage() {
				this.$router.push(`/pages`)
			},
			onFieldUpdate(fieldId, newValue) {
				Vue.set(this.recordWip, fieldId, newValue)
				this.$store.commit('editPreview/update', { fieldId, newValue })
			},
			save() {
				if (this.isNewRecord) {
					var newRecordId = fireDB.ref(`/sites/${this.site.siteId}/pages`).push(this.recordWip)
				}
				else {
					var objectToSave = _.clone(this.recordWip)
					fireDB.ref(`/sites/${this.site.siteId}/pages/${this.editId}`).update(objectToSave)
				}
				this.gotoListPage()
			},
		},
	}

</script>

