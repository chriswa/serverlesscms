<template>
	<div>
		<v-text-field
			:label="label"
			:value="value"
			@input="$emit('input', $event)"
			multi-line
		></v-text-field>
	</div>
</template>

<script>
	export default {
		props: [ 'value', 'label' ],
		methods: {
		},
	}
</script>

<style scoped>
	.input-group { margin: 0; }
</style>
