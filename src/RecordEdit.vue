<template>
	<CrudEdit
		:loaded="loaded"
		:fields="fields"
		:record="recordScratch"
		@fieldUpdate="onFieldUpdate"
	>
		<span slot="titleText">
			<span v-if="isSingleRecordSection">
				{{ section.name }}
			</span>
			<span v-else-if="isNewRecord">
				<router-link :to="`/record/${sectionId}/`">{{ section.name }}</router-link> &mdash; create {{ recordTitle }}
			</span>
			<span v-else>
				<router-link :to="`/record/${sectionId}/`">{{ section.name }}</router-link> &mdash; modify {{ recordTitle }}
			</span>
		</span>
		<div slot="buttons">
			<v-btn :disabled="isUnchanged" @click.native.stop="save">Save</v-btn>
			<v-btn :disabled="isUnchanged" @click.native.stop="init" v-if="isSingleRecordSection">Cancel</v-btn>
			<v-btn :disabled="false"       @click.native.stop="gotoListPage" v-else>Cancel</v-btn>
		</div>
	</CrudEdit>
</template>

<script>

	import FirebaseRefManager from './FirebaseRefManager'

	export default {
		props: [ "sectionId", "recordId" ],
		data() {
			return {
				loaded:       	false,
				recordSource: 	undefined,
				recordScratch:	undefined,
			}
		},
		computed: {
			site()                 	{ return this.$store.get.site                                  	},
			sections()             	{ return this.site.sections                                    	},
			section()              	{ return this.sections[this.sectionId]                         	},
			fields()               	{ return this.section.fields                                   	},
			sortedFields()         	{ return _(this.fields).toPairs().sortBy('1.order').value()    	},
			titleField()           	{ return this.section.titleField                               	},
			isSingleRecordSection()	{ return this.section.type === 'single'                        	},
			isNewRecord()          	{ return !this.isSingleRecordSection && !this.recordId         	},
			recordTitle()          	{ return this.loaded ? this.recordScratch[this.titleField] : ''	},
			isUnchanged()          	{ return _.isEqual(this.recordSource, this.recordScratch)      	},
		},
		mounted() {
			this.init()
		},
		watch: {
			$route(to, from) {
				this.init()
			},
		},
		methods: {
			init() {
				var recordIdToLoad = this.isSingleRecordSection ? 'single' : this.recordId
				if (recordIdToLoad) {
					this.loaded = false
					fireDB.ref(`/sites/${this.site.siteId}/records/${this.sectionId}/${recordIdToLoad}`).once('value', snapshot => {
						this.recordSource 	= snapshot.val()
						this.recordScratch	= _.clone(this.recordSource)
						this.loaded       	= true
					})
				}
				else {
					// creating a new record
					this.recordSource 	= _.mapValues(this.fields, () => { return "" })
					this.recordScratch	= _.clone(this.recordSource)
					this.loaded       	= true
				}
			},
			gotoListPage() {
				this.$router.push(`/record/${this.sectionId}/`)
			},
			onFieldUpdate(fieldId, newValue) {
				this.recordScratch[fieldId] = newValue
			},
			save() {
				var recordIdToSave = this.isSingleRecordSection ? 'single' : this.recordId
				if (this.isNewRecord) {
					var newRecordId = fireDB.ref(`/sites/${this.site.siteId}/records/${this.sectionId}`).push(this.recordScratch)
				}
				else {
					var objectToSave = _.clone(this.recordScratch) // { ...this.recordScratch }
					objectToSave.updatedDate = Firebase.ServerValue.TIMESTAMP
					if (this.isNewRecord) {
						objectToSave.createDate = Firebase.ServerValue.TIMESTAMP
					}
					fireDB.ref(`/sites/${this.site.siteId}/records/${this.sectionId}/${recordIdToSave}`).set(objectToSave)
				}
				if (this.isSingleRecordSection) {
					this.init()
				}
				else {
					this.gotoListPage()
				}
			},
		},
	}

</script>

<style scoped>
.card__title a { color: white; text-decoration: none; font-weight: bold; margin-right: 5px; }
</style>
