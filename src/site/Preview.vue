<template>
	<div>
		<div ref="preview" :style="{ width: '100%', height: '100vh', overflow: 'hidden' }"></div>
	</div>
</template>

<script>

	import navigationHijackingScript from '../util/PreviewNagivationControlScript'

	export default {
		data() {
			return {
				path: '/',
			}
		},
		computed: {
			site()          	{ return this.$store.get.site                                         	},
			ready()         	{ return this.site.ready                                              	},
			pageId()        	{ return this.ready && _.findKey(this.site.pages, { path: this.path })	},
			page()          	{ return this.ready && this.site.pages[this.pageId]                   	},
			pageTemplateId()	{ return this.page && this.page.template                              	},
			pageTemplate()  	{ return this.ready && this.site.templates[this.pageTemplateId]       	},
		},
		watch: {
			ready(val)	{ this.updatePreview()	},
			path(val) 	{ this.updatePreview()	},
		},
		mounted() {
			this.iframe                	= document.createElement('iframe')
			this.iframe.style.width    	= '100%'
			this.iframe.style.minHeight	= '100vh'
			this.iframe.style.border   	= 'none'
			this.$refs.preview.appendChild(this.iframe)

			window.addEventListener('message', this.onMessage, false)

			//this.$watch('templateView',    () => { this.updatePreview() }, { deep: true })
			//this.$watch('templateStrings', () => { this.updatePreview() }, { deep: true })

			this.updatePreview()
		},
		beforeDestroy() {
			window.removeEventListener('message', this.onMessage)
		},
		methods: {
			updatePreview() {
				console.log(`updatePreview...`)

				if (!this.ready) {
					this.setIframeContent("Loading...")
					return
				}
				if (!this.page) {
					this.setIframeContent(`Could not find Page for path "${this.path}"`)
					return
				}
				if (!this.pageTemplate) {
					this.setIframeContent(`Could not find Template "${this.pageTemplateId}"`)
					return
				}

				this.setIframeContent("Rendering...")

				var templateView = {} ////////////////////////

				var dustTemplate = this.pageTemplate.content

				var dustCompiledTemplate = dust.compile(dustTemplate)
				var dustLoadedTemplate = dust.loadSource(dustCompiledTemplate)
				dust.render(dustLoadedTemplate, templateView, (err, out) => {

					if (err) {
						console.log("Template render error!", err)
						this.setIframeContent(err)
					}
					else {
						console.log("Template render success!", out)
						this.setIframeContent(out)
					}

				})
			},
			setIframeContent(html) {
				this.iframe.contentWindow.document.open()
				this.iframe.contentWindow.document.write(html + navigationHijackingScript)
				this.iframe.contentWindow.document.close()
			},
			onMessage(event) {
				if (event.data.navigate) {
					console.log(`Preview iframe navigation detected: ${event.data.navigate}`)
					this.path = event.data.navigate
				}
			},
		},
	}

</script>

