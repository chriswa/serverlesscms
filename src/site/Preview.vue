<template>
	<div>
		<div ref="preview" :style="{ width: '100%', height: '100vh', overflow: 'hidden' }"></div>
	</div>
</template>

<script>

	import navigationHijackingScript from '../util/PreviewNagivationControlScript'

	import FirebaseCache from '../util/FirebaseCache'
	var firebaseCache = new FirebaseCache(fireDB.ref(), 5)

	var templateView = {
		hello: "world",
	}

	export default {
		data() {
			return {
				path:             	'/',
				preparedTemplates:	{},
			}
		},
		computed: {
			site()          	{ return this.$store.get.site                                         	},
			ready()         	{ return this.site.ready                                              	},
			pageId()        	{ return this.ready && _.findKey(this.site.pages, { path: this.path })	},
			page()          	{ return this.ready && this.site.pages[this.pageId]                   	},
			pageTemplateId()	{ return this.page && this.page.template                              	},
			templateContents() {
				if (!this.ready) { return {} }
				const editPreview = this.$store.get.editPreview
				var templateContentByName = _.zipObject(_.map(this.site.templates, 'name'), _.map(this.site.templates, 'content'))
				if (editPreview.ready && editPreview.type === 'Template') {
					templateContentByName[editPreview.record.name] = editPreview.record.content
				}
				return templateContentByName
			},
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

			this.$watch('templateContents', this.onTemplatesChange.bind(this))
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

				var dustLoadedTemplate = this.preparedTemplates[this.pageTemplateId]

				if (!dustLoadedTemplate) {
					this.setIframeContent(`Template is being prepared...`)
					return
				}


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
			onTemplatesChange(newTemplates, oldTemplates) {
				console.log(`Preview watch templates... ${oldTemplates} => ${newTemplates}`)
				_.each(Object.keys(newTemplates), newKey => {
					if (newTemplates[newKey] !== oldTemplates[newKey]) {
						var dustLoadedTemplate
						try {
							console.log(`Compiling template "${newKey}"...`)
							dustLoadedTemplate = dust.loadSource(dust.compile(newTemplates[newKey]))
						}
						catch (err) {
							console.log(`Template parsing error for "${newKey}": ${err}`)
							dustLoadedTemplate = dust.loadSource(dust.compile(`Template parsing error for "${newKey}": ${err}`))
						}
						Vue.set(this.preparedTemplates, newKey, dustLoadedTemplate)
					}
				})
				_.each(Object.keys(oldTemplates), oldKey => {
					if (!newTemplates.hasOwnProperty(oldKey)) {
						Vue.delete(this.preparedTemplates, oldKey)
					}
				})
				this.updatePreview()
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

