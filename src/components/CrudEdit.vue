<template>

	<MyDataTable>
		<tbody>
			<tr v-for="[fieldId, field] in sortedFields">

				<td>
					{{ field.name }}
				</td>
				<td>
					<component :is="components[fieldId] || 'CrudEditTextfield'" :value="record[fieldId]" @input="$emit('fieldUpdate', fieldId, $event)"></component>
				</td>

			</tr>
		</tbody>
	</MyDataTable>

</template>

<script>
	export default {
		props: {
			fields:    	{ type: Object, required: true, },
			record:    	{ type: Object, default: () => { return {} }, },
			components:	{ type: Object, default: () => { return {} }, },
		},
		computed: {
			sortedFields()	{ return _(this.fields).toPairs().sortBy('1.order').value()	},
		},
		methods: {
		},
	}
</script>
