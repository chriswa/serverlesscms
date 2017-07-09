<template>
	<div>

		<v-card>
			<v-card-title class="primary white--text" v-if="recordId">
				Modify record "{{ recordTitle }}" in {{ sections[sectionId].name }} section
			</v-card-title>
			<v-card-title class="primary white--text" v-else>
				Add record in {{ sections[sectionId].name }} section
			</v-card-title>
			<v-card-text>

				<my-data-table v-if="loaded">
					<tbody>
						<tr v-for="[fieldId, field] in sortedFields">

							<td>{{ field.name }}</td>
							<td>{{ record[fieldId] }}</td>

						</tr>
					</tbody>
				</my-data-table>

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
				record: undefined,
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
				if (this.recordId) {
					return this.loaded ? this.record[this.titleField] : 'loading...'
				}
				else {
					return 'New Record'
				}
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
						this.record = snapshot.val()
						this.loaded = true
					})
				}
				else {
					// creating a new record
					this.loaded = true
				}
			},
		},
	}

</script>

