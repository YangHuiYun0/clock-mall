// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import store from './store/'
import VueLazyload from 'vue-lazyload'
import router from './router'
import ElementUI from 'element-ui'
import { getStore } from './util/storage'
// import { userInfo } from './api'
import 'element-ui/lib/theme-chalk/index.css'

import Breadcrumb from './components/breadcrumb/index';

Vue.component('Breadcrumb', Breadcrumb);

Vue.use(VueLazyload, {
  
  loading: '/static/images/load.gif'

})
Vue.config.productionTip = false
Vue.use(ElementUI);


// const whiteList = ['/home', '/before-goods', '/login', '/register', '/before-goodsDetails', '/thanks', '/search', '/refreshsearch', '/refreshgoods'] // 不需要登陆的页面
// router.beforeEach(function (to, from, next) {
//   let params = {
//     params: {
//       token: getStore('token')
//     }
//   }
//   userInfo(params).then(res => {
//     if (res.result.state !== 1) { // 没登录
//       if (whiteList.indexOf(to.path) !== -1) { // 白名单
//         next()
//       } else {
//         next('/login')
//       }
//     } else {
//       store.commit('RECORD_USERINFO', {info: res.result})
//       if (to.path === '/login') { //  跳转到
//         next({path: '/'})
//       }
//       next()
//     }
//   })
// })
/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
