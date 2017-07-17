<template>
	<div>
		<v-card>
			<v-card-title class="primary white--text">
				<slot name="titleText">titleText</slot>
			</v-card-title>

			<v-card-text v-if="loaded">

				<MyDataTable>
					<tbody>
						<tr v-for="[fieldId, field] in sortedFields">

							<td>
								{{ field.name }}
							</td>
							<td>
								<component :is="components[fieldId] || 'CrudEditTextfield'" :value="record[fieldId]" @input="onInput(fieldId, $event)"></component>
							</td>

						</tr>
					</tbody>
				</MyDataTable>

			</v-card-text>
			<v-card-text class="text-xs-right" v-if="loaded">

				<slot name="buttons"></slot>
				
			</v-card-text>
		</v-card>

		<LoadingIndicator v-if="!loaded"></LoadingIndicator>

	</div>

</template>

<script>
	export default {
		props: {
			loaded:    	{ type: Boolean, default: true, },
			fields:    	{ type: Object, required: true, },
			record:    	{ type: Object, default: () => { return {} }, },
			components:	{ type: Object, default: () => { return {} }, },
		},
		computed: {
			sortedFields()	{ return _(this.fields).toPairs().sortBy('1.order').value()	},
		},
		methods: {
			onInput(fieldId, newValue) {
				this.$emit('fieldUpdate', fieldId, $event)
			},
		},
	}
</script>
