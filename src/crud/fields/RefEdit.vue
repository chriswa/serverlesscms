<template>
	<div>
		<v-select
			:label="field.name"
			:items="field.items"
			:value="value && value.value"
			@input="onInput"
		></v-select>
	</div>
</template>

<script>
	export default {
		props: [ 'value', 'field' ],
		methods: {
			onInput(newValue) {
				const text = _.find(this.field.items, ({ value, text }) => value === newValue).text
				this.$emit('input', { value: newValue, text })
			},
		},
	}
</script>

<style scoped>
	.input-group { margin: 0; }
</style>
