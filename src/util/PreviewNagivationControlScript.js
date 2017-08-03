export default `<scr`+`ipt>
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
