export default {
	text: {
		show: require('./fields/TextDisplay.vue'),
		edit: require('./fields/TextEdit.vue'),
		default: "",
	},
	clob: {
		show: require('./fields/ClobDisplay.vue'),
		edit: require('./fields/ClobEdit.vue'),
		default: "",
	},
	ref: {
		show: require('./fields/RefDisplay.vue'),
		edit: require('./fields/RefEdit.vue'),
		default: { text: "(none)", value: "", },
	},
}
