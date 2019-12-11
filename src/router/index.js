import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
const home = r => require.ensure([], () => r(require('@/page/home')), 'home');

const routes = [
	{
		path: '/',
		component: home
  },
]

export default new Router({
	routes,
	strict: process.env.NODE_ENV !== 'production',
})