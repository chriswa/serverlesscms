<template>
	<div>
		<v-text-field :value="value" @input="$emit('input', $event)" single-line hide-details></v-text-field>
	</div>
</template>

<script>
	export default {
		props: [ 'value' ],
		methods: {
		},
	}
</script>
