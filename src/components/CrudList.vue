<template>
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
					<component :is="components[fieldId] || 'CrudShowText'" :value="record[fieldId]"></component>
				</td>

				<td align="right" width="140">
					<v-btn icon small @click.native.stop="$emit('modify', recordId)"><v-icon medium dark mdi>lead-pencil</v-icon></v-btn>
					<v-btn icon small @click.native.stop="$emit('delete', recordId)"><v-icon medium dark>delete</v-icon></v-btn>
				</td>

			</tr>
		</tbody>
		<tbody v-else>
			<tr>
				<td :colspan="sortedFields.length + 1">
					<slot name="noResults">No records</slot>
				</td>
			</tr>
		</tbody>
	</MyDataTable>
</template>

<script>
	export default {
		props: {
			fields:    	{ type: Object, required: true, },
			records:   	{ type: Object, default: () => { return {} }, },
			components:	{ type: Object, default: () => { return {} }, },
		},
		computed: {
			sortedFields() 	{ return _(this.fields).toPairs().sortBy('1.order').value() 	},
			sortedRecords()	{ return _(this.records).toPairs().sortBy('1.order').value()	},
		},
	}
</script>
