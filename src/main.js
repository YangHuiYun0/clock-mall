// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import store from './store/'
import VueLazyload from 'vue-lazyload'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import Breadcrumb from './components/breadcrumb/index';

Vue.component('Breadcrumb', Breadcrumb);

Vue.use(VueLazyload, {
  
  loading: '/static/images/load.gif'

})
Vue.config.productionTip = false
Vue.use(ElementUI);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
