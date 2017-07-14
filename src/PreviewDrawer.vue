<template>
	<v-navigation-drawer persistent right disable-route-watcher :value="true" :style="{ width: width + 'px', transition: 'none' }">

		<div style="position: relative;">
			<div style="background-color: #999; border-right: 1px solid #868686; width: 7px; height: 100vh; position: absolute; cursor: col-resize;" ref="resizeHandle"></div>
		</div>
		
		<div style="margin-left: 8px;">

			<slot name="content"></slot>

		</div>
	
	</v-navigation-drawer>
</template>

<script>
	export default {
		props: [ 'width' ],
		data() {
			return {
			}
		},
		mounted() {
			var onMouseMove = event => { // only attached during mousedown
				var desiredWidth = window.innerWidth - event.pageX
				desiredWidth = Math.min(desiredWidth, window.innerWidth - 200)
				desiredWidth = Math.max(desiredWidth, 200)
				this.$emit('setWidth', desiredWidth)
			}
			var onMouseUp = event => { // only attached during mousedown
				document.removeEventListener('mousemove',	onMouseMove)
				document.removeEventListener('mouseup',  	onMouseUp)
				event.preventDefault()
				event.stopPropagation()
			}
			this.$refs.resizeHandle.addEventListener('mousedown', event => {
				document.addEventListener('mousemove',	onMouseMove)
				document.addEventListener('mouseup',  	onMouseUp)
				event.preventDefault()
				event.stopPropagation()
			})
		},
	}
</script>
