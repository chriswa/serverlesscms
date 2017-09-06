const store = require('../../store').default // WHY CAN"T I USE IMPORT HERE?!

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
		multiSection: {
			order: 2,
			name: 'Detail Section',
			type: 'ref',
			get items() {
				var items = _.map(store.get.site.sections, (section, sectionId) => {
					return {
						text: section.name,
						value: sectionId,
					}
				})
				items.unshift({ text: '(none)', value: '', })
				return items
			},
		},
		template: {
			order: 3,
			name: 'Template',
			type: 'ref',
			//default: '',
			get items() {
				var items = _.map(store.get.site.templates, (template, templateId) => {
					return {
						text: template.name,
						value: templateId,
					}
				})
				items.unshift({ text: '(none)', value: '', })
				return items
			},
		},
	},
}
