const store = require('../store').default // WHY CAN"T I USE IMPORT HERE?!

module.exports = {
	fields: {
		name: {
			order: 0,
			name: 'Name',
		},
		path: {
			order: 1,
			name: 'Path',
		},
		template: {
			order: 2,
			name: 'Template',
			type: 'ref',
			get items() {
				return _.map(store.get.site.templates, (template, templateId) => {
					return {
						text: template.name,
						value: templateId,
					}
				})
			},
		},
		multiSection: {
			order: 3,
			name: 'multiSection',
		},
	},
}
