module.exports = {
	fields: {
		name: {
			order: 0,
			name: 'Name',
		},
		type: {
			order: 1,
			name: 'Type',
			type: 'ref',
			get items() {
				var items = [
					{ text: '(none)',	value: '',      	},
					{ text: 'Single',	value: 'single',	},
					{ text: 'Multi', 	value: 'multi', 	},
				]
				return items
			},
		},
	}
}
