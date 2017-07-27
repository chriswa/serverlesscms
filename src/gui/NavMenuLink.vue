<template>
	<v-list-tile @click.native.stop="onClick">
		<v-list-tile-action>
			<v-icon>{{ icon }}</v-icon>
		</v-list-tile-action>
		<v-list-tile-content>
			<v-list-tile-title>
				<slot></slot>
			</v-list-tile-title>
		</v-list-tile-content>
	</v-list-tile>
</template>

<script>
	export default {
		props: {
			icon: { type: String, default: "assignment" },
			text: { type: String },
		},
		methods: {
			onClick() {
				this.$emit('click')
			},
		},
		computed: {
		},
	}
</script>

