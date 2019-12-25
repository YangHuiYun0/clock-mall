import Vue from 'vue';
import Vuex from 'vuex';
// import cloneDeep from 'lodash/cloneDeep';
import getters from './getters';
import user from './modules/user';
import common from './modules/common';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    user,
    common
  },
  mutations: {
    // 重置vuex本地储存状态
    resetStore(state) {
      Object.keys(state).forEach((key) => {
        // state[key] = cloneDeep(window.SITE_CONFIG['storeState'][key]);
      });
    }
  },
  getters,
  login: false,   // 是否登录
  userInfo: null, // 用户信息
  cartList: [],   // 加入购物车列表
  showMoveImg: false, // 显示飞入图片
  elLeft: 0,
  elTop: 0,
  moveImgUrl: null,
  cartPositionT: 0, // 购物车位置
  cartPositionL: 0,
  receiveInCart: false, // 是否进入购物车
  showCart: false // 是否显示购物车
});

export default store;
