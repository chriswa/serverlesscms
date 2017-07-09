<template>
	<v-list-tile @click.native.stop="onClick">
		<v-list-tile-action>
			<v-icon :fa="isFa" :mdi="isMdi">{{ iconName }}</v-icon>
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
			isFa() {
				return !!this.icon.match(/^fa-/)
			},
			isMdi() {
				return !!this.icon.match(/^mdi-/)
			},
			iconName() {
				return this.icon.replace(/^(?:fa|mdi)-/, '')
			},
		},
	}
</script>

