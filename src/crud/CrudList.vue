<template>
	<div>
		<v-card>
			<v-card-title class="primary white--text">
				<slot name="titleText">titleText</slot>
			</v-card-title>
			<v-card-text v-if="loaded">

				<MyDataTable>
					<thead>
						<tr>
							<th v-for="[ fieldId, field ] in sortedFields">{{ field.name }}</th>
							<th><!-- actions --></th>
						</tr>
					</thead>
					<tbody v-if="sortedRecords.length">
						<tr v-for="[ recordId, record ] in sortedRecords">

							<td v-for="[ fieldId, field ] in sortedFields">

								<component
									:is="getFieldComponent(field.type)"
									:field="field"
									:value="record[fieldId]"
								></component>

							</td>

							<td align="right" width="140">
								<v-btn icon small @click.native.stop="$emit('modify', recordId)"><v-icon medium dark>mdi-lead-pencil</v-icon></v-btn>
								<v-btn icon small @click.native.stop="$emit('delete', recordId)"><v-icon medium dark>delete</v-icon></v-btn>
							</td>

						</tr>
					</tbody>
					<tbody v-else>
						<tr>
							<td :colspan="sortedFields.length + 1">
								<slot name="noResultsText">No Results</slot>
							</td>
						</tr>
					</tbody>
				</MyDataTable>

			</v-card-text>
			<v-card-text class="text-xs-right" v-if="loaded">

				<v-btn primary @click.native.stop="$router.push(`edit`)"><slot name="createButtonText">Create New</slot></v-btn>

			</v-card-text>
		</v-card>

		<LoadingIndicator v-if="!loaded"></LoadingIndicator>

	</div>
</template>

<script>
	import fieldComponents from './crudFieldTypes.js'
	export default {
		props: {
			loaded: 	{ type: Boolean, default: true, },
			fields: 	{ type: Object, required: true, },
			records:	{ type: Object, default: () => { return {} }, },
		},
		computed: {
			sortedFields() 	{ return _(this.fields).toPairs().sortBy('1.order').value() 	},
			sortedRecords()	{ return _(this.records).toPairs().sortBy('1.order').value()	},
		},
		methods: {
			getFieldComponent(type)	{ return fieldComponents[type] ? fieldComponents[type].show : fieldComponents['text'].show	}, 
		},
	}
</script>
