<template>
	<div>
		
		<CrudEdit
			:fields="fields"
			:record="recordScratch"
			@fieldUpdate="onFieldUpdate"
		>
			<span slot="titleText">
				Configure Templates &mdash; {{ recordScratch.name || '(untitled)' }}
			</span>
			<div slot="buttons">
				<v-btn :disabled="isUnchanged" @click.native.stop="save">{{ isNewRecord ? 'Create' : 'Update' }}</v-btn>
				<v-btn :disabled="false"       @click.native.stop="gotoListPage">Cancel</v-btn>
			</div>
		</CrudEdit>
	
	</div>
</template>

<script>

	import fields from './TemplateCommon'

	export default {
		props: [ "templateId" ],
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
			isNewRecord() 	{ return !this.templateId                                	},
			isUnchanged() 	{ return _.isEqual(this.recordSource, this.recordScratch)	},
			recordSource()	{ return this.site.templates[this.templateId] || {}      	},
		},
		methods: {
			init() {
				this.recordScratch = _.clone(this.recordSource)
			},
			gotoListPage() {
				this.$router.push(`/templates`)
			},
			onFieldUpdate(fieldId, newValue) {
				Vue.set(this.recordScratch, fieldId, newValue)
			},
			save() {
				if (this.isNewRecord) {
					var newRecordId = fireDB.ref(`/sites/${this.site.siteId}/templates`).push(this.recordScratch)
				}
				else {
					var objectToSave = _.clone(this.recordScratch)
					fireDB.ref(`/sites/${this.site.siteId}/templates/${this.templateId}`).update(objectToSave)
				}
				this.gotoListPage()
			},
		},
	}

</script>

