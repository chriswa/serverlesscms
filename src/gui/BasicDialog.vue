<template>
	<v-dialog-fixed :value="value" width="40%">
		<v-card>
			<v-card-title :class=" 'info white--text ' + cls ">{{ title }}</v-card-title>
			<v-card-text style="padding-bottom: 0;">

				<slot></slot>

			</v-card-text>
			<v-card-text style="padding-top: 0;" class="text-xs-right">
				<v-btn @click.native.stop="clickYes">{{ yes }}</v-btn>
				<v-btn @click.native.stop="clickNo" v-if="no">{{ no }}</v-btn>
			</v-card-text>
		</v-card>
	</v-dialog-fixed>
</template>

<script>
	export default {
		props: {
			value: { type: Boolean, default: false },
			title: { type: String,  default: () => { return window.location.hostname } },
			yes:   { type: String,  default: 'Ok' },
			no:    { type: String,  default: '' },
			cls:   { type: String,  default: '' }
		},
		methods: {
			clickYes() {
				this.$emit('yes')
				this.$emit('input', false)
			},
			clickNo() {
				this.$emit('no')
				this.$emit('input', false)
			},
		},
	}
</script>

<style scoped>
</style>
