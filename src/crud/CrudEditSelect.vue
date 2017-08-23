<template>
	<div>
		<v-select
			:label="field.name"
			:items="field.items"
			:value="value"
			@input="onInput"
		></v-select>
	</div>
</template>

<script>
	export default {
		props: [ 'value', 'field' ],
		methods: {
			onInput(val) {
				console.log(`select ${val}`)
				this.$emit('input', val)
			},
		},
	}
</script>

<style scoped>
	.input-group { margin: 0; }
</style>
