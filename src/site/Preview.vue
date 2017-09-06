<template>
	<div>
		<PreviewFrame
			ref="frame"
			@navigate="onNavigate"
		></PreviewFrame>
	</div>
</template>

<script>

	import FirebaseCache from '../util/FirebaseCache'
	var firebaseCache = new FirebaseCache(fireDB.ref())

	//
	// TODO:	add something called PreviewModelProxy between Preview and FirebaseCache
	//      	- it needs access to this.$store.editPreview
	//      	- preview should make all database requests through it
	//      	- iff a single record is requested, editPreview should be checked and allowed to override it
	//      	- it'll need to inform Preview of "activeUpdates"
	//      	- n.b. needs to be able to fire an active update if the currently edited article is "canceled"!
	//

	var templateView = {}

	function findPageIdForPath(pages, path) {
		return _.findKey(pages, page => {
			if (page.multiSection && page.multiSection.value) {
				return path.startsWith(page.path) && path.indexOf('/', page.path.length) === -1
			}
			else {
				return path === page.path
			}
		})
	}

	function getRecordIdFromPath(path) {
		return /[^\/]+$/.exec(path)[0]
	}

	function getTemplateContentsWithEditPreview(templates, editPreview) {
		var templateContentsById = _.mapValues(templates, 'content')
		if (editPreview.ready && editPreview.type === 'Template') {
			templateContentsById[editPreview.record.editId] = editPreview.record.content
		}
		return templateContentsById
	}

	function updatePreparedTemplates(preparedTemplates, newTemplates, oldTemplates) {
		// this function is essentially an optimized verison of the following single line:
		// this.preparedTemplates = _.mapValues(newTemplates, t => dust.loadSource(dust.compile(t))
		let changesMade = false
		if (!oldTemplates) { oldTemplates = {} }
		//console.log(`Preview watch templates... ${oldTemplates} => ${newTemplates}`)
		_.each(Object.keys(newTemplates), newKey => {
			if (newTemplates[newKey] !== oldTemplates[newKey]) {
				changesMade = true
				var dustLoadedTemplate
				try {
					//console.log(`Compiling template "${newKey}"...`)
					dustLoadedTemplate = dust.loadSource(dust.compile(newTemplates[newKey]))
				}
				catch (err) {
					console.log(`Template parsing error for "${newKey}": ${err}`)
					dustLoadedTemplate = dust.loadSource(dust.compile(`Template parsing error for "${newKey}": ${err}`))
				}
				Vue.set(preparedTemplates, newKey, dustLoadedTemplate)
			}
		})
		_.each(Object.keys(oldTemplates), oldKey => {
			if (!newTemplates.hasOwnProperty(oldKey)) {
				changesMade = true
				Vue.delete(preparedTemplates, oldKey)
			}
		})
		return changesMade
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
			site()            	{ return this.$store.get.site                                                                              	},
			ready()           	{ return this.site.ready                                                                                   	},
			pageId()          	{ return this.ready && findPageIdForPath(this.site.pages, this.path)                                       	},
			page()            	{ return this.ready && this.site.pages[this.pageId]                                                        	},
			templateContents()	{ return this.ready && getTemplateContentsWithEditPreview(this.site.templates, this.$store.get.editPreview)	},
		},
		watch: {
			ready(val)	{ console.log(`ready watcher`); this.renderPreviewContent()	},
			path(val) 	{ console.log(`path watcher`);  this.renderPreviewContent()	},
		},
		mounted() {

			firebaseCache.activeUpdateCallback = () => {
				console.log(`activeUpdateCallback`)
				this.renderPreviewContent()
			}

			templateView.foreach = ((chunk, context, bodies, params) => {
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
			}).bind(this)

			this.$watch('templateContents', this.onTemplatesChange.bind(this), { immediate: true })
		},
		methods: {
			renderPreviewContent() {

				if (!this.ready) {
					this.setFrameContent("Loading...")
					return
				}
				if (!this.page) {
					this.setFrameContent(`Could not find Page for path "${this.path}"`)
					return
				}
				if (!this.page.template) {
					this.setFrameContent(`Could not find Template for Page "${this.page.name}"`)
					return
				}

				const dustLoadedTemplate = this.preparedTemplates[this.page.template.value]

				if (!dustLoadedTemplate) {
					this.setFrameContent(`Compiling template...`)
					return
				}

				console.log(`renderPreviewContent...`)
				firebaseCache.tick() // mark all active updates as "recent" and unsubscribe from any we haven't used in several render cycles

				const _preview = {
					path:    	this.path,
					page:    	this.page.name,
					pageId:  	this.pageId,
					template:	this.page.template,
				}

				const templateContext = _.extend({ _preview }, templateView)

				Promise.resolve(templateContext).then(templateContext => {
					// if this is a "multiSection", we need to load a record and add it to the context before rendering the template...
					if (this.page.multiSection && this.page.multiSection.value) {
						const sectionId = this.page.multiSection.value
						const recordId = getRecordIdFromPath(this.path)
						return firebaseCache.get(`/sites/${this.$store.get.site.siteId}/records/${sectionId}/${recordId}`).then(record => {
							return _.extend({ record: record }, templateContext)
						})
					}
					return templateContext
				}).then(templateContext => {
					// render with dust, now that we have prepared our template context!
					dust.render(dustLoadedTemplate, templateContext, (err, out) => {
						if (err) {
							console.log("Template render error!", err)
							this.setFrameContent(err)
						}
						else {
							//console.log("Template render success!", out)
							this.setFrameContent(out)
						}
					})
				})
			},
			setFrameContent(html) {
				this.$refs.frame.setContent(html)
			},
			onNavigate(newPath) {
				this.path = newPath
			},
			onTemplatesChange(newTemplates, oldTemplates) {
				const changesMade = updatePreparedTemplates(this.preparedTemplates, newTemplates, oldTemplates)
				if (changesMade) {
					console.log(`onTemplatesChange (or editPreview, due to potentially cancelling a template edit)`)
					this.renderPreviewContent()
				}
			},
		},
	}

</script>

