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
  getters
});

export default store;
