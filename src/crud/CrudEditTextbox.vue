<template>
	<div>
		<div class="{ monospacedTextArea }" v-if="!isAceEditor">
			<v-text-field
				:label="field.name"
				:value="value"
				@input="$emit('input', $event)"
				multi-line
				auto-grow
				rows="1"
				spellcheck="false"
			></v-text-field>
		</div>
		<div v-else>
			<AceEditor
				:value="value"
				@input="$emit('input', $event)"
			></AceEditor>
		</div>
	</div>
</template>

<script>
	export default {
		props: [ 'value', 'field' ],
		components: {
			AceEditor: require('./AceEditor.vue'),
		},
		computed: {
			monospacedTextArea() {
				return !!this.field.monospace
			},
			isAceEditor() {
				return !!this.field.ace
			},
		},
	}
</script>

<style>
	.monospacedTextArea textarea {
		font-family: monospace;
	}
</style>
