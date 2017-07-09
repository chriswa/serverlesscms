<template>
	<div>

		<v-card>
			<v-card-title class="primary white--text">
				List of records in {{ section.name }} section
			</v-card-title>
			<v-card-text>
				
				<my-data-table>
					<thead>
						<tr>
							<th v-for="[ fieldId, field ] in sortedFields">{{ field.name }}</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody v-if="loaded">
						<tr v-for="[ recordId, record ] in sortedRecords">

							<td v-for="[ fieldId, field ] in sortedFields">{{ record[fieldId] }}</td>

							<td>
								<v-btn icon small @click.native.stop="modify(recordId)"><v-icon medium dark mdi>table-edit</v-icon></v-btn>
								<v-btn icon small @click.native.stop=""><v-icon medium dark>delete</v-icon></v-btn>
							</td>

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
		props: [ "auth", "siteMeta", "sections", "sectionId" ],
		data() {
			return {
				loaded: false,
				records: undefined,
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
			sortedRecords() {
				return _(this.records).toPairs().sortBy('1.order').value()
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
				this.loaded = false
				this.firebaseRefManager.add(fireDB.ref(`/sites/${this.auth.userData.site}/records/${this.sectionId}`).limitToFirst(100), 'value', snapshot => {
					this.records = snapshot.val()
					this.loaded = true
				})
			},
			modify(recordId) {
				this.$router.push(`edit/${recordId}`)
			},
		},
	}

</script>

