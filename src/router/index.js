import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
const home = r => require.ensure([], () => r(require('@/page/home')), 'home');
const main = r => require.ensure([], () => r(require('@/page/main')), 'main');

const routes = [
	{
		path: '/',
		component: home,
		redirect: '/main',
		children: [
			{path: 'main', component: main},
		]
	},
	
]

export default new Router({
	routes,
	strict: process.env.NODE_ENV !== 'production',
})