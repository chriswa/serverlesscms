<template>
	<div>

		<div style="height: 20px;"></div>

		<div v-for="[fieldId, field] in sortedFields">

			<component
				:is="getFieldComponent(field.type)"
				:field="field"
				:value="record[fieldId]"
				@input="onInput(fieldId, $event)"
			></component>

		</div>

		<div style="height: 20px;"></div>

		<div class="text-xs-right">

			<slot name="buttons"></slot>

		</div>
				
	</div>

</template>

<script>
	import fieldComponents from './crudFieldTypes.js'
	export default {
		props: {
			loaded:	{ type: Boolean, default: true, },
			fields:	{ type: Object, required: true, },
			record:	{ type: Object, default: () => { return {} }, },
		},
		computed: {
			sortedFields()	{ return _(this.fields).toPairs().sortBy('1.order').value()	},
		},
		methods: {
			onInput(fieldId, newValue) {
				this.$emit('fieldUpdate', fieldId, newValue)
			},
			getFieldComponent(type)	{ return fieldComponents[type] ? fieldComponents[type].edit : fieldComponents['text'].edit	}, 
		},
	}
</script>
