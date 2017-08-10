<template>
	<div>
		<div ref="preview" :style="{ width: '100%', height: '100vh%', overflow: 'hidden' }"></div>
	</div>
</template>

<script>

	import navigationHijackingScript from '../util/PreviewNagivationControlScript'

	export default {
		mounted() {
			this.iframe                	= document.createElement('iframe')
			this.iframe.style.width    	= '100%'
			this.iframe.style.minHeight	= '100vh'
			this.iframe.style.border   	= 'none'
			this.$refs.preview.appendChild(this.iframe)

			window.addEventListener('message', this.onMessage, false)
		},
		beforeDestroy() {
			window.removeEventListener('message', this.onMessage)
		},
		methods: {
			setContent(html) {
				this.iframe.contentWindow.document.open()
				this.iframe.contentWindow.document.write(navigationHijackingScript + html)
				this.iframe.contentWindow.document.close()
			},
			onMessage(event) {
				if (event.data.navigate) {
					console.log(`Preview iframe navigation detected: ${event.data.navigate}`)
					this.$emit('navigate', event.data.navigate)
				}
			},
		},
	}

</script>
