<template>
	<div>

		<v-card>
			<v-card-title class="primary white--text">
				{{ section.name }}
			</v-card-title>
			<v-card-text v-if="loaded">
				
				<my-data-table>
					<thead>
						<tr>
							<th v-for="[ fieldId, field ] in sortedFields">{{ field.name }}</th>
							<th><!-- actions --></th>
						</tr>
					</thead>
					<tbody v-if="sortedRecords.length">
						<tr v-for="[ recordId, record ] in sortedRecords">

							<td v-for="[ fieldId, field ] in sortedFields">{{ record[fieldId] }}</td>

							<td align="right">
								<v-btn icon small @click.native.stop="modify(recordId)"><v-icon medium dark mdi>table-edit</v-icon></v-btn>
								<v-btn icon small @click.native.stop=""><v-icon medium dark>delete</v-icon></v-btn>
							</td>

						</tr>
					</tbody>
					<tbody v-else>
						<tr>
							<td :colspan="sortedFields.length + 1">
								No records
							</td>
						</tr>
					</tbody>
				</my-data-table>

			</v-card-text>
			<v-card-text class="text-xs-right" v-if="loaded">

				<v-btn primary @click.native.stop="$router.push(`/content/${sectionId}/edit`)">Create New</v-btn>

			</v-card-text>
		</v-card>

	</div>
</template>

<script>

	import FirebaseRefManager from './FirebaseRefManager'

	export default {
		props: [ "sectionId" ],
		data() {
			return {
				loaded: 	false,
				records:	undefined,
			}
		},
		computed: {
			site()         	{ return this.$store.get.site                               	},
			section()      	{ return this.site.sections[this.sectionId]                 	},
			fields()       	{ return this.section.fields                                	},
			sortedFields() 	{ return _(this.fields).toPairs().sortBy('1.order').value() 	},
			sortedRecords()	{ return _(this.records).toPairs().sortBy('1.order').value()	},
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
				this.firebaseRefManager.add(fireDB.ref(`/sites/${this.site.siteId}/records/${this.sectionId}`).limitToFirst(100), 'value', snapshot => {
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

