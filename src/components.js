var componentsToLoad = {
	
	'gui/': [
		'BasicDialog', 'MyDataTable', 'LoadingIndicator', 'NavMenuLink',
	],

	'crud/': [
		'CrudList', 'CrudShowText',
		'CrudEdit', 'CrudEditTextfield', 'CrudEditTextbox',
	],
	
}
_.each(componentsToLoad, (componentNames, dir) => {
	_.each(componentNames, componentName => {
		Vue.component(componentName, require(`./${dir}${componentName}.vue`))
	})
})
