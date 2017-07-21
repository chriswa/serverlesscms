var routes = [
	{
		path:      '/', 
		redirect:  to => {
			console.log('redirecting / to /dashboard')
			return '/dashboard'
		},
	},
	{
		path:      '/dashboard', 
		component: require('./site/Dashboard.vue'),
	},
	{
		path:      '/record/:sectionId/', 
		component: require('./site/RecordList.vue'),
		props:     true,
	},
	{
		path:      '/record/:sectionId/edit/:recordId', 
		component: require('./site/RecordEdit.vue'),
		props:     true,
	},
	// {
	//	path:      '/record/:sectionId/create', 
	//	component: require('./site/RecordEdit.vue'),
	//	props:     true,
	// },
	{
		path:      '/record/:sectionId/edit', // single record section
		component: require('./site/RecordEdit.vue'),
		props:     true,
	},
	{
		path:      '/sections/',
		component: require('./site/SectionList.vue'),
		props:     true,
	},
	{
		path:      '/pages/',
		component: require('./site/PageList.vue'),
		props:     true,
	},
	{
		path:      '/templates/',
		component: require('./site/TemplateList.vue'),
		props:     true,
	},
]

module.exports = routes
