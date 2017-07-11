<template>
	<div>

		<v-card>
			
			<v-card-title class="primary white--text" v-if="isSingleRecordSection">
				{{ section.name }}
			</v-card-title>
			<v-card-title class="primary white--text" v-else-if="recordId">
				<router-link :to="`/content/${sectionId}/list`">{{ section.name }}</router-link> &mdash; {{ recordTitle }}
			</v-card-title>
			<v-card-title class="primary white--text" v-else>
				<router-link :to="`/content/${sectionId}/list`">{{ section.name }}</router-link> &mdash; {{ recordTitle }} (new)
			</v-card-title>
			<v-card-text>

				<my-data-table v-if="loaded">
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
				<my-data-table v-else>
					<tbody><tr><td>Loading...</td></tr></tbody>
				</my-data-table>

			</v-card-text>
			<v-card-text class="text-xs-right">

				<v-btn :disabled="isUnchanged" @click.native.stop="">Save</v-btn>
				<v-btn :disabled="isUnchanged" @click.native.stop="init()" v-if="isSingleRecordSection">Cancel</v-btn>
				<v-btn :disabled="false"       @click.native.stop="$router.push(`/content/${sectionId}/list`)" v-else>Cancel</v-btn>

			</v-card-text>
		</v-card>

	</div>
</template>

<script>

	import FirebaseRefManager from './FirebaseRefManager'

	export default {
		props: [ "auth", "siteMeta", "sections", "sectionId", "recordId" ],
		data() {
			return {
				loaded: false,
				recordSource: undefined,
				recordScratch: undefined,
			}
		},
		computed: {
			section() {
				return this.sections[this.sectionId]
			},
			fields() {
				return this.section.fields
			},
			sortedFields() {
				return _(this.fields).toPairs().sortBy('1.order').value()
			},
			titleField() {
				return this.section.titleField
			},
			isSingleRecordSection() {
				return this.section.type === 'single'
			},
			recordTitle() {
				return this.loaded ? this.recordScratch[this.titleField] : 'loading...'
			},
			isUnchanged() {
				return _.isEqual(this.recordSource, this.recordScratch)
			},
		},
		mounted() {
			this.firebaseRefManager = new FirebaseRefManager()
			this.init()
		},
		beforeDestroy() {
			this.firebaseRefManager.removeAll()
		},
		watch: {
			$route(to, from) {
				this.firebaseRefManager.removeAll()
				this.init()
			},
		},
		methods: {
			init() {
				var recordIdToLoad = this.isSingleRecordSection ? 'single' : this.recordId
				if (recordIdToLoad) {
					this.loaded = false
					this.firebaseRefManager.add(fireDB.ref(`/sites/${this.auth.userData.site}/records/${this.sectionId}/${recordIdToLoad}`), 'value', snapshot => {
						this.recordSource = snapshot.val()
						this.recordScratch = _.clone(this.recordSource)
						this.loaded = true
					})
				}
				else {
					// creating a new record
					this.recordSource = _.mapValues(this.fields, () => { return "" })
					this.recordScratch = _.clone(this.recordSource)
					this.loaded = true
				}
			},
		},
	}

</script>

<style scoped>
.card__title a { color: white; text-decoration: none; font-weight: bold; margin-right: 5px; }
</style>
