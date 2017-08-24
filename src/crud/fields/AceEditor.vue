<template>
	<div style="{ cssHeight }"></div>
</template>

<script>
	export default {
		props: {
			'value': { type: String, default: "" },
			'field': { type: Object },
		},
		data() {
			return {
				editor: undefined,
				height: 100,
				minHeight: 100,
				maxHeight: 200,
			}
		},
		computed: {
			cssHeight() {
				return this.height + 'px'
			},
		},
		mounted() {
			Vue.nextTick(() => {
				this.editor = ace.edit(this.$el)

				this.editor.$blockScrolling = Infinity // Automatically scrolling cursor into view after selection change this will be disabled in the next version set editor.$blockScrolling = Infinity to disable this message
				this.editor.setTheme("ace/theme/idle_fingers")
				this.editor.getSession().setMode("ace/mode/handlebars")
				this.editor.setShowPrintMargin(false)

				this.editor.setOptions({
					autoScrollEditorIntoView:	true,
					minLines:                	5,
					maxLines:                	Infinity,
				})

				this.editor.setValue(this.value, -1)

				this.editor.getSession().on('change', e => {
					this.$emit('input', this.editor.getValue())
				})
			})
		},
		beforeDestroy() {
			this.editor.destroy()
		},
	}
</script>
