<template>
	<div :style="{ width: '100%', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', }" v-if="enabled">
		<v-progress-circular indeterminate class="primary--text"></v-progress-circular>
	</div>
</template>

<script>

	const millisecsBeforeEnabled = 300

	export default {
		data() {
			return {
				timeout: undefined,
				enabled: false,
			}
		},
		mounted() {
			this.timeout = setTimeout(() => {
				this.enabled = true
			}, millisecsBeforeEnabled)
		},
		beforeDestroy() {
			if (this.timeout) {
				clearTimeout(this.timeout)
			}
		},
	}
</script>
