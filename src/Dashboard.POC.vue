<template>
	<div>

		<v-card>
			<v-card-row>
				<v-card-title class="primary white--text">
					Sample Content
				</v-card-title>
			</v-card-row>
			<v-card-row>
				<input v-model="templateView.subheading">
			</v-card-row>
		</v-card>

		<br>

		<v-card>
			<v-card-row>
				<v-card-title class="primary white--text">
					Template "sampleTemplateId"
				</v-card-title>
			</v-card-row>
			<v-card-row>
				<textarea v-model="templateStrings.sampleTemplateId" style="width: 100%; min-height: 200px; font-family: monospace;" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"></textarea>
			</v-card-row>
		</v-card>

		<br>

		<v-card>
			<v-card-row>
				<v-card-title class="primary white--text">
					Preview
				</v-card-title>
			</v-card-row>
			<v-card-row>
				<div ref="preview" style="width: 100%; height: 100%;"></div>
			</v-card-row>
		</v-card>

	</div>
</template>

<script>

	import firebase from './firebase-integration'
	var db = firebase.database()

	var templates = {
		sampleTemplateId: `<!DOCTYPE html>
<body style="background-color: pink;">
<title>{ title }</title>
<h3>{title} &mdash; {subheading}</h3>
{#helperfoo}helperblock {foo}{/helperfoo}
<ul>
{#items}
	<li>{name}</li>
{/items}
</ul>`
	}

	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	function query(sql, callback) {
		setTimeout(() => { callback(null, { foo: "bar" }) }, 1000)
	}

	export default {
		props: [ "auth" ],
		data() {
			return {
				templateView: {
					title: 'My Title',
					subheading: 'My subheading',
					items: [
						{ name: "Item 1", },
						{ name: "Item 2", },
					],
					helperfoo(chunk, context, bodies, params) {
						console.log('HELPER')
						return chunk.map(function(chunk) {
							query("SELECT name FROM USERS", function(err, data) {
								return chunk.render(bodies.block, context.push(data)).end()
							})
						})
					},
				},
				templateStrings: templates,
			}
		},
		mounted() {
			this.iframe = document.createElement('iframe')
			this.iframe.style.width = this.iframe.style.height = '100%'
			this.iframe.style.border = 'none'
			this.$refs.preview.appendChild(this.iframe)

			this.$watch('templateView',    () => { this.updatePreview() }, { deep: true })
			this.$watch('templateStrings', () => { this.updatePreview() }, { deep: true })

			this.updatePreview()
		},
		watch: {
			templateView() {
				debugger
			},
		},
		methods: {
			updatePreview() {
				this.setIframeContent("Rendering...")

				//console.log(this.templateStrings['sampleTemplateId'])
				var compiled = dust.compile(this.templateStrings['sampleTemplateId'])
				var tmpl = dust.loadSource(compiled)
				dust.render(tmpl, this.templateView, (err, out) => {
					if (err) {
						console.error(`Template rendering error!`, err)
					}
					console.log(err, out)
					this.setIframeContent(out)
				})
			},
			setIframeContent(html) {
				this.iframe.contentWindow.document.open()
				this.iframe.contentWindow.document.write(html)
				this.iframe.contentWindow.document.close()
			},
		},
	}
</script>

