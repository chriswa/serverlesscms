<template>
	<ContentCard :title="'Configure Templates &mdash; ' + (recordWip.name || '(untitled)')">
		
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

	import { fields } from './schema/TemplateSchema'

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
			fields()      	{ return fields                                      	},
			site()        	{ return this.$store.get.site                        	},
			isNewRecord() 	{ return !this.editId                                	},
			isUnchanged() 	{ return _.isEqual(this.recordSource, this.recordWip)	},
			recordSource()	{ return this.site.templates[this.editId] || {}      	},
		},
		methods: {
			init() {
				this.recordWip = _.clone(this.recordSource)
				this.$store.commit('editPreview/assign', {
					type:  	'Template',
					editId:	this.editId,
					record:	this.recordWip,
				})
			},
			gotoListPage() {
				this.$router.push(`/templates`)
			},
			onFieldUpdate(fieldId, newValue) {
				Vue.set(this.recordWip, fieldId, newValue)
				this.$store.commit('editPreview/update', { fieldId, newValue })
			},
			save() {
				if (this.isNewRecord) {
					var newRecordId = fireDB.ref(`/sites/${this.site.siteId}/templates`).push(this.recordWip)
				}
				else {
					var objectToSave = _.clone(this.recordWip)
					fireDB.ref(`/sites/${this.site.siteId}/templates/${this.editId}`).update(objectToSave)
				}
				this.gotoListPage()
			},
		},
	}

</script>

