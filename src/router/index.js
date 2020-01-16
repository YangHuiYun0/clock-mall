import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
const home = r => require.ensure([], () => r(require('@/page/home')), 'home');
const main = r => require.ensure([], () => r(require('@/page/main')), 'main');
const goods = r => require.ensure([], () => r(require('@/page/goods')), 'goods');
const goodsDetails = r => require.ensure([], () => r(require('@/page/goodsDetails')), 'goodsDetails');
const cart = r => require.ensure([], () => r(require('@/page/cart')), 'cart');

// 个人中心
const user = r => require.ensure([], () => r(require('@/page/User/user')), 'user');
const orderList = r => require.ensure([], () => r(require('@/page/User/children/order')), 'orderList');
const addressList = r => require.ensure([], () => r(require('@/page/User/children/addressList')), 'addressList');
const routes = [
	{
		path: '/',
		component: home,
		redirect: '/main',
		children: [
			{path: 'main', component: main},
			{path: 'goods', component: goods},
			{path: 'goodsDetails', name: 'goodsDetails', component: goodsDetails},
		]
	}, 
	{path: '/cart', name: 'cart', component: cart},
	{
		path: '/user',
		name: 'user',
		component: user,
		redirect: '/user/orderList',
		children:[
			{path: 'orderList', name: '订单列表', component: orderList},
			// {path: 'orderDetail', name: '订单详情', component: orderDetail},
			// {path: 'information', name: '账户资料', component: information},
			{path: 'addressList', name: '收货地址', component: addressList},
		]
	}
]

export default new Router({
	routes,
	strict: process.env.NODE_ENV !== 'production',
})