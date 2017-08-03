var componentsToLoad = {
	
	'gui/': [
		'BasicDialog', 'MyDataTable', 'LoadingIndicator', 'NavMenuLink', 'ContentCard',
	],

	'crud/': [
		'CrudList', // 'CrudShowText',
		'CrudEdit', // 'CrudEditTextfield', 'CrudEditTextbox', 'CrudEditSelect',
	],
	
}
_.each(componentsToLoad, (componentNames, dir) => {
	_.each(componentNames, componentName => {
		Vue.component(componentName, require(`./${dir}${componentName}.vue`))
	})
})
