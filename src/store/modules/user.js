import webConfig from '@/../config/index.js';
// import { login, getUserInfo } from '../../api/login';
import { getToken, setToken } from '../../util/auth';
import { clearLoginInfo } from '../../util/index';

const user = {
  state: {
    name: '',
    email: '',
    token: getToken(),
    globalConfig: webConfig.globalWebsiteConfig // 获取全局配置信息
  },
  mutations: {
    // 设置用户名
    SET_NAME: (state, name) => {
      state.name = name;
    },
    // 设置登录账号
    SET_EMAIL: (state, email) => {
      state.email = email;
    }
  },
  actions: {
    // 登录
    Login({ commit }, userInfo) {
      // 移除前导空格、尾随空格和行终止符
      const userName = userInfo.username.trim();
      return new Promise((resolve, reject) => {
        // 真实登录
        login(userName, userInfo.password).then(res => {
          if (res && res.code === 0) {
            setToken(res.token); // 设置 token
            resolve();
          } else {
            reject(res);
          }
        });
      });
    },
    // 获取用户信息
    GetUserInfo({ commit }) {
      return new Promise((resolve, reject) => {
        // 真实获取用户数据
        getUserInfo().then(res => {
          commit('SET_NAME', res.user.username);
          commit('SET_EMAIL', res.user.email);
          resolve();
        }).catch(err => {
          reject(err);
        });
        // 虚拟获取用户数据
        // commit('SET_NAME', '测试级管理员');
        // commit('SET_EMAIL', 'svip@soundbus.cn');
        // resolve();
      });
    },
    // 登出
    LogOut({ commit }) {
      return new Promise((resolve, reject) => {
        // 点击退出就简单粗暴的删除 token
        clearLoginInfo();
        resolve();
      });
    }
  }
};

export default user;
