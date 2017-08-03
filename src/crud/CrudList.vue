<template>
	<div>
		<div>

			<MyDataTable v-if="sortedRecords.length">
				<thead>
					<tr>
						<th v-for="[ fieldId, field ] in sortedFields">{{ field.name }}</th>
						<th><!-- actions --></th>
					</tr>
				</thead>
				<tbody>
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
							<v-btn icon small @click.native.stop="$emit('remove', recordId)"><v-icon medium dark>delete</v-icon></v-btn>
						</td>

					</tr>
				</tbody>
			</MyDataTable>

			<v-alert warning value="true" v-else>
				No {{ plural }} found
			</v-alert>

		</div>
		<div class="text-xs-right" style="margin-top: 10px;">

			<v-btn primary @click.native.stop="$emit('create')">Create {{ singular }}</v-btn>

		</div>

	</div>
</template>

<script>
	import fieldComponents from './crudFieldTypes.js'
	export default {
		props: {
			fields:  	{ type: Object, required: true, },
			records: 	{ type: Object, default: () => { return {} }, },
			         	
			singular:	{ type: String, default: "singular", },
			plural:  	{ type: String, default: "plurals", },
			title:   	{ type: String, default: "Title", },
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
