import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
//=====================================前台的路由==========================================
const home = r => require.ensure([], () => r(require('@/page/before-page/home')), 'home');
const beforemain = r => require.ensure([], () => r(require('@/page/before-page/main')), 'main');
const beforegoods = r => require.ensure([], () => r(require('@/page/before-page/goods')), 'goods');
const beforegoodsDetails = r => require.ensure([], () => r(require('@/page/before-page/goodsDetails')), 'goodsDetails');
const cart = r => require.ensure([], () => r(require('@/page/before-page/cart')), 'cart');

// 个人中心
const user = r => require.ensure([], () => r(require('@/page/before-page/User/user')), 'user');
const orderList = r => require.ensure([], () => r(require('@/page/before-page/User/children/order')), 'orderList');
const addressList = r => require.ensure([], () => r(require('@/page/before-page/User/children/addressList')), 'addressList');
const userInfo = r => require.ensure([], () => r(require('@/page/before-page/User/children/userInfo')), 'userInfo');
const checkout = r => require.ensure([], () => r(require('@/page/before-page/checkout')), 'checkout');


// ===================================管理后台的路由=========================================
const webmain = r => require.ensure([], () => r(require('@/page/web-page/main')), 'main');
const webhome = r => require.ensure([], () => r(require('@/page/web-page/home')), 'home');
const webbannerList = r => require.ensure([], () => r(require('@/page/web-page/home-set/bannerList')), 'bannerList');
const webbannerDetails = r => require.ensure([], () => r(require('@/page/web-page/home-set/bannerDetails')), 'bannerDetails');
const webgoodsList = r => require.ensure([], () => r(require('@/page/web-page/goods-manage/goodsList')), 'goodsList');
const webgoodsDetails = r => require.ensure([], () => r(require('@/page/web-page/goods-manage/goodsDetails')), 'goodsDetails');
const webbrandList = r => require.ensure([], () => r(require('@/page/web-page/goods-manage/brandList')), 'brandList');
const webbrandDetails = r => require.ensure([], () => r(require('@/page/web-page/goods-manage/brandDetails')), 'brandDetails');
const weborderList = r => require.ensure([], () => r(require('@/page/web-page/order-manage/orderList')), 'orderList');
const weborderDetails = r => require.ensure([], () => r(require('@/page/web-page/order-manage/orderDetails')), 'orderDetails');
const websaleSetList = r => require.ensure([], () => r(require('@/page/web-page/order-manage/saleSetList')), 'saleSetList');
const webreturnApply = r => require.ensure([], () => r(require('@/page/web-page/order-manage/returnApply')), 'returnApply');
const webreturnApplyDetail = r => require.ensure([], () => r(require('@/page/web-page/order-manage/returnApplyDetail')), 'returnApplyDetail');
const webmemberList = r => require.ensure([], () => r(require('@/page/web-page/member-manage/memberList')), 'memberList');

// ===================================登录页面路由=========================================
const login = r => require.ensure([], () => r(require('@/page/login')), 'login');
const refresh = r => require.ensure([], () => r(require('@/page/refresh')), 'refresh');

const routes = [
	{
    path:'/login',
    component:login
  },
  {
    path:'/refresh',
    component:refresh
  },
	// =================前台===================
	{
		path: '/',
		component: home,
		redirect: '/before-main',
		children: [
			{path: 'before-main', component: beforemain},
			{path: 'before-goods', component: beforegoods},
			{path: 'before-goodsDetails', name: 'goodsDetails', component: beforegoodsDetails},
		]
	}, 
  {path: '/before-cart', name: 'cart', component: cart},
  {path: '/before-checkout', name: 'checkout', component: checkout},
	{
		path: '/user',
		name: 'user',
		component: user,
		redirect: '/user/before-orderList',
		children:[
			{path: 'before-orderList', name: '订单列表', component: orderList},
			{path: 'before-userInfo', name: '个人资料', component: userInfo},
			{path: 'before-addressList', name: '收货地址', component: addressList},
		]
	},
	// ===============后台===================
	{
    path:'/web-main',
    component:webmain,
    name:'',
		children: [
			{
        path: '/web-home',
        component: webhome,
        meta: [],
      },{
        path: '/web-bannerList',
        component: webbannerList,
        meta: [],
      },{
        path: '/web-bannerDetails',
        component: webbannerDetails,
        meta: [],
      },{
        path: '/web-goodsList',
        component: webgoodsList,
        meta: [],
      },{
        path: '/web-goodsDetails',
        component: webgoodsDetails,
        meta: [],
      },{
        path:'/web-brandList',
        component: webbrandList,
        meta: [],
      },{
        path: '/web-brandDetails',
        component: webbrandDetails,
        meta: [],
      },{
        path: '/web-orderList',
        component: weborderList,
        meta: [],
      },{
        path: '/web-orderDetails',
        component: weborderDetails,
        meta: [],
      },{
        path: '/web-saleSetList',
        component: websaleSetList,
        meta: [],
      },{
        path: '/web-returnApply',
        component: webreturnApply,
        meta: [],
      },{
        path: '/web-returnApplyDetail',
        component: webreturnApplyDetail,
        meta: [],
      },{
        path: '/web-memberList',
        component: webmemberList,
        meta: [],
      },
		]
	}
]

const routerPush = Router.prototype.push
  Router.prototype.push = function push(location) {
    return routerPush.call(this, location).catch(error=> error)
}

export default new Router({
	routes,
	strict: process.env.NODE_ENV !== 'production',
})