var componentsToLoad = [
	
	// generic stuff
	'BasicDialog', 'MyDataTable', 'LoadingIndicator',

	// crud list and subcomponents
	'CrudList', 'CrudShowText',
	
	// crud edit and subcomponents
	'CrudEdit', 'CrudEditTextfield',
	
]
_.each(componentsToLoad, componentName => {
	Vue.component(componentName, require(`./components/${componentName}.vue`))
})
