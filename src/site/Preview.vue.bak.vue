<template>
	<div>

		<div ref="preview" :style="{ width: '100%', height: '100vh', overflow: 'hidden' }"></div>

	</div>
</template>

<script>

	var templateCode = `<!DOCTYPE html>
<body style="background-color: pink;">
<title>{ title }</title>
<h3>{title} &mdash; {subheading}</h3>
<p><a href="/foo/123" data-href="/bar/quux">/foo/123</a></p>
{#helperfoo}helperblock {foo}{/helperfoo}
<ul>
{#items}
<li>{name}</li>
{/items}
</ul>`
	var templateView = {
		title: 'My Title',
		subheading: 'My subheading',
		items: [
			{ name: "Item 1", },
			{ name: "Item 2", },
			{ name: "Item 3", },
		],
	}
	var navigationHijackingScript = `<scr`+`ipt>
(() => {
	var location = window.document.location

	var onNavigation = event => {

		var targetHref = document.activeElement.href
		if (targetHref) {
			var targetUrlPath = targetHref.replace(/^\\w+:\\/\\/\\/?[^\\/]+/, '')
			window.parent.postMessage({ navigate: targetUrlPath }, '*')
		}
		else {
			var dataHref = document.activeElement.getAttribute('data-href')
			if (dataHref) {
				window.parent.postMessage({ navigate: dataHref }, '*')
			}
		}

		// prevent navigation
		var originalHashValue = location.hash
		window.setTimeout(() => {
			location.hash = 'preventNavigation' + Math.random()
			location.hash = originalHashValue
		}, 0)
	}

	window.addEventListener('beforeunload',	onNavigation, false)
	window.addEventListener('unload',      	onNavigation, false)
})()
</scr`+`ipt>`

	export default {
		data() {
			return {
			}
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
				this.setIframeContent("Rendering...")
				var compiled = dust.compile(templateCode)
				var tmpl = dust.loadSource(compiled)
				dust.render(tmpl, templateView, (err, out) => {
					console.log("Template rendered! (err, out)", err, out)
					this.setIframeContent(out)
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
				}
			},
		},
	}

</script>

