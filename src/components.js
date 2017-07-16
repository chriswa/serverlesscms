var componentsToLoad = [
	'BasicDialog', 'MyDataTable',
	'CrudList', 'CrudShowText',
	'CrudEdit', 'CrudEditTextfield',
]
_.each(componentsToLoad, componentName => {
	Vue.component(componentName, require(`./components/${componentName}.vue`))
})
