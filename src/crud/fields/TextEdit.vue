<template>
	<div>
		<v-text-field
			:label="field.name"
			:value="value"
			@input="$emit('input', $event)"
		></v-text-field>
	</div>
</template>

<script>
	export default {
		props: [ 'value', 'field' ],
	}
</script>

<style scoped>
	.input-group { margin: 0; }
</style>
