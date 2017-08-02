<template>
	<CrudEdit
		:loaded="loaded"
		:fields="fields"
		:record="recordWip"
		@fieldUpdate="onFieldUpdate"
	>
		<span slot="titleText">
			<span v-if="isSingleRecordSection">
				{{ section.name }}
			</span>
			<span v-else>
				<router-link :to="`/record/${sectionId}/`">{{ section.name }}</router-link> <span v-if="loaded">&mdash; {{ recordTitle || '(untitled)' }}</span>
			</span>
		</span>
		<div slot="buttons">
			<v-btn :disabled="isUnchanged" @click.native.stop="save">{{ isNewRecord ? 'Create' : 'Update' }}</v-btn>
			<v-btn :disabled="isUnchanged" @click.native.stop="init" v-if="isSingleRecordSection">Cancel</v-btn>
			<v-btn :disabled="false"       @click.native.stop="gotoListPage" v-else>Cancel</v-btn>
		</div>
	</CrudEdit>
</template>

<script>
	import FirebaseRefManager from '../util/FirebaseRefManager'

	export default {
		props: [ "sectionId", "recordId" ],
		data() {
			return {
				loaded:      	false,
				recordSource:	undefined,
				recordWip:   	undefined,
			}
		},
		computed: {
			site()                 	{ return this.$store.get.site                                     	},
			sections()             	{ return this.site.sections                                       	},
			section()              	{ return this.sections[this.sectionId]                            	},
			fields()               	{ return this.section.fields                                      	},
			sortedFields()         	{ return _(this.fields).toPairs().sortBy('1.order').value()       	},
			titleField()           	{ return this.section.titleField                                  	},
			isSingleRecordSection()	{ return this.section.type === 'single'                           	},
			isNewRecord()          	{ return !this.isSingleRecordSection && !this.recordId            	},
			recordTitle()          	{ return this.loaded ? this.recordWip[this.titleField] : undefined	},
			isUnchanged()          	{ return _.isEqual(this.recordSource, this.recordWip)             	},
		},
		mounted() {
			this.init()
		},
		beforeDestroy() {
			this.$store.commit('editPreview/clear')
		},
		methods: {
			init() {
				var recordIdToLoad = this.isSingleRecordSection ? 'single' : this.recordId
				if (recordIdToLoad) {
					this.loaded = false
					fireDB.ref(`/sites/${this.site.siteId}/records/${this.sectionId}/${recordIdToLoad}`).once('value', snapshot => {
						this.recordSource	= snapshot.val()
						this.onRecordLoaded()
					})
				}
				else {
					// creating a new record
					this.recordSource	= _.mapValues(this.fields, () => { return "" })
					this.onRecordLoaded()
				}
			},
			onRecordLoaded() {
				this.recordWip	= _.clone(this.recordSource)
				this.loaded   	= true
				this.$store.commit('editPreview/assign', {
					type:     	'Record',
					sectionId:	this.sectionId,
					editId:   	this.recordId,
					record:   	this.recordWip,
				})
			},
			gotoListPage() {
				this.$router.push(`/record/${this.sectionId}`)
			},
			onFieldUpdate(fieldId, newValue) {
				Vue.set(this.recordWip, fieldId, newValue)
				this.$store.commit('editPreview/update', { fieldId, newValue })
			},
			save() {
				var recordIdToSave = this.isSingleRecordSection ? 'single' : this.recordId
				if (this.isNewRecord) {
					var newRecordId = fireDB.ref(`/sites/${this.site.siteId}/records/${this.sectionId}`).push(this.recordWip)
				}
				else {
					var objectToSave = _.clone(this.recordWip) // { ...this.recordWip }
					objectToSave.updatedDate = firebase.database.ServerValue.TIMESTAMP
					if (this.isNewRecord) {
						objectToSave.createDate = firebase.database.ServerValue.TIMESTAMP
					}
					fireDB.ref(`/sites/${this.site.siteId}/records/${this.sectionId}/${recordIdToSave}`).update(objectToSave)
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
