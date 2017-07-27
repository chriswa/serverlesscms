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
	{
		path:      '/record/:sectionId/edit',
		component: require('./site/RecordEdit.vue'),
		props:     true,
	},

	{
		path:      '/sections/',
		component: require('./site/SectionList.vue'),
		props:     true,
	},
	{
		path:      '/sections/edit/:sectionId',
		component: require('./site/SectionEdit.vue'),
		props:     true,
	},
	{
		path:      '/sections/edit',
		component: require('./site/SectionEdit.vue'),
		props:     true,
	},

	{
		path:      '/pages/',
		component: require('./site/PageList.vue'),
		props:     true,
	},
	//{
	//	path:      '/pages/edit/:pageId',
	//	component: require('./site/PageEdit.vue'),
	//	props:     true,
	//},
	//{
	//	path:      '/pages/edit',
	//	component: require('./site/PageEdit.vue'),
	//	props:     true,
	//},

	{
		path:      '/templates/',
		component: require('./site/TemplateList.vue'),
		props:     true,
	},
	{
		path:      '/templates/edit/:templateId',
		component: require('./site/TemplateEdit.vue'),
		props:     true,
	},
	{
		path:      '/templates/edit',
		component: require('./site/TemplateEdit.vue'),
		props:     true,
	},

	{
		path:     	'*',
		component:	require('./site/RouteNotFound.vue'),
		props:    	true,
	},
]

module.exports = routes
