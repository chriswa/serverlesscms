<template>
	<div>
		<PreviewFrame
			ref="frame"
			@navigate="path = $event"
		></PreviewFrame>
	</div>
</template>

<script>

	import FirebaseCache from '../util/FirebaseCache'
	var firebaseCache = new FirebaseCache(fireDB.ref(), 5)
	window.fbc = firebaseCache

	var templateView

	function findPageIdForPath(pages, path) {
		return _.findKey(pages, page => {
			if (page.multiSection) {
				return path.startsWith(page.path) && path.indexOf('/', page.path.length) === -1
			}
			else {
				return path === page.path
			}
		})
	}

	export default {
		components: {
			PreviewFrame: require('./PreviewFrame.vue'),
		},
		data() {
			return {
				path:             	'/',
				preparedTemplates:	{},
			}
		},
		computed: {
			site()          	{ return this.$store.get.site                                       	},
			ready()         	{ return this.site.ready                                            	},
			pageId()        	{ return this.ready && findPageIdForPath(this.site.pages, this.path)	},
			page()          	{ return this.ready && this.site.pages[this.pageId]                 	},
			pageTemplateId()	{ return this.page && this.page.template                            	},
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

			templateView = {
				foo: {bar: 'baaz'},
				foreach(chunk, context, bodies, params) {
					const sectionId = params.section
					if (!sectionId) { throw new Error(`foreach: section is required`) }
					const section = this.site.sections[ sectionId ]
					if (!section) { throw new Error(`foreach: section not found: ${sectionId}`) }
					return chunk.map(chunk => {
						firebaseCache.get(`/sites/${this.$store.get.site.siteId}/records/${sectionId}`).then(records => {
							_.each(records, (record, recordKey) => {
								var newContext = record
								newContext['_key'] = recordKey
								if (params.var) { newContext = { [params.var]: newContext } }
								chunk.render(bodies.block, context.push(newContext))
							})
							chunk.end()
						})
					})
				},
				load(chunk, context, bodies, params) {
					const sectionId = params.section
					if (!sectionId) { throw new Error(`load: "section" is required`) }
					const section = this.site.sections[ sectionId ]
					if (!section) { throw new Error(`load: "section" not found: "${sectionId}"`) }
					const recordId = params.id
					if (!recordId) { throw new Error(`load: "id" is required`) }
					return chunk.map(chunk => {
						firebaseCache.get(`/sites/${this.$store.get.site.siteId}/records/${sectionId}/${recordId}`).then(record => {
							var newContext = record
							if (params.var) { newContext = { [params.var]: newContext } }
							chunk.render(bodies.block, context.push(newContext))
							chunk.end()
						})
					})
				},
			}
			templateView.foreach = templateView.foreach.bind(this)
			templateView.load = templateView.load.bind(this)

			this.$watch('templateContents', this.onTemplatesChange.bind(this), { immediate: true })
		},
		methods: {
			updatePreview() {
				console.log(`updatePreview...`)

				if (!this.ready) {
					this.setFrameContent("Loading...")
					return
				}
				if (!this.page) {
					this.setFrameContent(`Could not find Page for path "${this.path}"`)
					return
				}

				var dustLoadedTemplate = this.preparedTemplates[this.pageTemplateId]

				if (!dustLoadedTemplate) {
					this.setFrameContent(`Template is being prepared...`)
					return
				}


				dust.render(dustLoadedTemplate, templateView, (err, out) => {

					if (err) {
						console.log("Template render error!", err)
						this.setFrameContent(err)
					}
					else {
						console.log("Template render success!", out)
						this.setFrameContent(out)
					}

				})
			},
			onTemplatesChange(newTemplates, oldTemplates) {
				if (!oldTemplates) { oldTemplates = {} }
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
			setFrameContent(html) {
				this.$refs.frame.setContent(html)
			},
		},
	}

</script>

