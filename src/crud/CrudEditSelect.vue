<template>
	<div>
		<v-select
			:label="field.name"
			:items="field.items"
			:value="value"
			@input="$emit('input', $event)"
		></v-select>
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
