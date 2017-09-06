<template>
	<div>
		<ContentCard :title="section.name + (isSingleRecordSection ? '' : (!loaded ? '' : (' &mdash; ' + (recordTitle || '(untitled)'))))">
			<CrudEdit
				v-if="loaded"
				:fields="fields"
				:record="recordWip"
				@fieldUpdate="onFieldUpdate"
			>
				<div slot="buttons">
					<v-btn :disabled="isUnchanged" @click.native.stop="save">{{ isNewRecord ? 'Create' : 'Update' }}</v-btn>
					<v-btn :disabled="isUnchanged" @click.native.stop="init" v-if="isSingleRecordSection">Cancel</v-btn>
					<v-btn :disabled="false"       @click.native.stop="gotoListPage" v-else>Cancel</v-btn>
				</div>
			</CrudEdit>
		</ContentCard>

		<LoadingIndicator v-if="!loaded"></LoadingIndicator>

	</div>
</template>

<script>
	import Crud from '../crud/Crud'
	import FirebaseRefManager from '../util/FirebaseRefManager'

	export default {
		props: [ "sectionId", "editId" ],
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
			isSingleRecordSection()	{ return this.section.type && this.section.type.value === 'single'	},
			isNewRecord()          	{ return !this.isSingleRecordSection && !this.editId              	},
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
				var editIdToLoad = this.isSingleRecordSection ? 'single' : this.editId
				if (editIdToLoad) {
					this.loaded = false
					fireDB.ref(`/sites/${this.site.siteId}/records/${this.sectionId}/${editIdToLoad}`).once('value', snapshot => {
						this.recordSource	= snapshot.val()
						this.onRecordLoaded()
					})
				}
				else {
					// creating a new record
					this.recordSource	= Crud.newRecord(this.fields)
					this.onRecordLoaded()
				}
			},
			onRecordLoaded() {
				this.recordWip	= _.clone(this.recordSource)
				this.loaded   	= true
				this.$store.commit('editPreview/assign', {
					type:     	'Record',
					sectionId:	this.sectionId,
					editId:   	this.editId,
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
				var editIdToSave = this.isSingleRecordSection ? 'single' : this.editId
				if (this.isNewRecord) {
					var newRecordId = fireDB.ref(`/sites/${this.site.siteId}/records/${this.sectionId}`).push(this.recordWip)
				}
				else {
					var objectToSave = _.clone(this.recordWip) // { ...this.recordWip }
					objectToSave.updatedDate = new Date().getTime() // avoid using firebase.database.ServerValue.TIMESTAMP so we don't recieve two firebase updates every record save, triggering two preview renders!
					if (this.isNewRecord) {
						objectToSave.createDate = new Date().getTime() // avoid using firebase.database.ServerValue.TIMESTAMP so we don't recieve two firebase updates every record save, triggering two preview renders!
					}
					console.log(`RecordEdit save:`, objectToSave)
					fireDB.ref(`/sites/${this.site.siteId}/records/${this.sectionId}/${editIdToSave}`).update(objectToSave)
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
