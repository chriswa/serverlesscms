var routes = []

routes.push({
	path:	    '/', 
	redirect: to => {
		console.log('redirecting / to /dashboard')
		return '/dashboard'
	}
})

const siteRoutes = [
	[ 'Dashboard', '/dashboard', require('./site/Dashboard.vue')	],

	[ 'RecordList',  	'/record/:sectionId/',            	require('./site/RecordList.vue')	],
	[ 'RecordEdit',  	'/record/:sectionId/edit/:editId',	require('./site/RecordEdit.vue')	],
	[ 'RecordCreate',	'/record/:sectionId/edit',        	require('./site/RecordEdit.vue')	],

	[ 'SectionList',  	'/sections/',            	require('./site/SectionList.vue')	],
	[ 'SectionEdit',  	'/sections/edit/:editId',	require('./site/SectionEdit.vue')	],
	[ 'SectionCreate',	'/sections/edit',        	require('./site/SectionEdit.vue')	],

	[ 'PageList',  	'/pages/',            	require('./site/PageList.vue')	],
	[ 'PageEdit',  	'/pages/edit/:editId',	require('./site/PageEdit.vue')	],
	[ 'PageCreate',	'/pages/edit',        	require('./site/PageEdit.vue')	],

	[ 'TemplateList',  	'/templates/',            	require('./site/TemplateList.vue')	],
	[ 'TemplateEdit',  	'/templates/edit/:editId',	require('./site/TemplateEdit.vue')	],
	[ 'TemplateCreate',	'/templates/edit',        	require('./site/TemplateEdit.vue')	],
]

_.each(siteRoutes, ([ name, path, component ]) => {
	routes.push({ name, path, component, props: true })
})

routes.push({ path:	'*', component:	require('./site/RouteNotFound.vue') })

module.exports = routes
