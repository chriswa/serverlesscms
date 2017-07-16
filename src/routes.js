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
		component: require('./Dashboard.vue'),
	},
	{
		path:      '/record/:sectionId/', 
		component: require('./RecordList.vue'),
		props:     true,
	},
	{
		path:      '/record/:sectionId/edit/:recordId', 
		component: require('./RecordEdit.vue'),
		props:     true,
	},
	// {
	//	path:      '/record/:sectionId/create', 
	//	component: require('./RecordEdit.vue'),
	//	props:     true,
	// },
	{
		path:      '/record/:sectionId/edit', // single record section
		component: require('./RecordEdit.vue'),
		props:     true,
	},
	{
		path:      '/sections/',
		component: require('./SectionList.vue'),
		props:     true,
	},
	{
		path:      '/pages/',
		component: require('./PageList.vue'),
		props:     true,
	},
	{
		path:      '/templates/',
		component: require('./TemplateList.vue'),
		props:     true,
	},
]

module.exports = routes
