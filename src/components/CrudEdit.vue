<template>
	<div>
		<v-card>
			<v-card-title class="primary white--text">
				<slot name="titleText">titleText</slot>
			</v-card-title>

			<v-card-text v-if="loaded">

				<div style="height: 20px;"></div>

				<div v-for="[fieldId, field] in sortedFields">

					<component
						:is="components[field.type] || 'CrudEditTextfield'"
						:value="record[fieldId]"
						:label="field.name"
						@input="onInput(fieldId, $event)"
						></component>

				</div>

				<div style="height: 20px;"></div>

				<div class="text-xs-right">

					<slot name="buttons"></slot>

				</div>
				
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
				this.$emit('fieldUpdate', fieldId, newValue)
			},
		},
	}
</script>
