<template>
	<v-card>
		<v-card-title class="primary white--text">
			{{ title }}
		</v-card-title>
		<v-card-text>
			<slot></slot>
		</v-card-text>
	</v-card>
</template>

<script>
	export default {
		props: ['title'],
	}
</script>
