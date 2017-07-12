<template>
	<div>

		<v-card>
			
			<v-card-title class="primary white--text" v-if="isSingleRecordSection">
				{{ section.name }}
			</v-card-title>
			<v-card-title class="primary white--text" v-else-if="isNewRecord">
				<router-link :to="`/content/${sectionId}/list`">{{ section.name }}</router-link> &mdash; create {{ recordTitle }}
			</v-card-title>
			<v-card-title class="primary white--text" v-else>
				<router-link :to="`/content/${sectionId}/list`">{{ section.name }}</router-link> &mdash; modify {{ recordTitle }}
			</v-card-title>
			<v-card-text v-if="loaded">

				<my-data-table>
					<tbody>
						<tr v-for="[fieldId, field] in sortedFields">

							<td>
								{{ field.name }}
							</td>
							<td>
								<v-text-field v-model="recordScratch[fieldId]" single-line hide-details></v-text-field>
							</td>

						</tr>
					</tbody>
				</my-data-table>

			</v-card-text>
			<v-card-text class="text-xs-right" v-if="loaded">

				<v-btn :disabled="isUnchanged" @click.native.stop="save">Save</v-btn>
				<v-btn :disabled="isUnchanged" @click.native.stop="init" v-if="isSingleRecordSection">Cancel</v-btn>
				<v-btn :disabled="false"       @click.native.stop="gotoListPage" v-else>Cancel</v-btn>

			</v-card-text>
		</v-card>

	</div>
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
				this.$router.push(`/content/${this.sectionId}/list`)
			},
			save() {
				var recordIdToSave = this.isSingleRecordSection ? 'single' : this.recordId
				if (this.isNewRecord) {
					var newRecordId = fireDB.ref(`/sites/${this.site.siteId}/records/${this.sectionId}`).push(this.recordScratch)
				}
				else {
					console.log(this.recordScratch)
					console.log(`/sites/${this.site.siteId}/records/${this.sectionId}/${recordIdToSave}` + ' SET!')
					fireDB.ref(`/sites/${this.site.siteId}/records/${this.sectionId}/${recordIdToSave}`).set(this.recordScratch)
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
