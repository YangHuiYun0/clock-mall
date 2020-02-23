import request from "../util/request";

export function getLogin(data){
  return request({
    url: '/login',
    method:'post',
    data
  })
}

export function getLogout() {
  return request({
      url:'/logout',
      method:'get',
  })
}

// 查询后台首页
export function getHomeInfo() {
  return request({
      url:'/home',
      method:'get',
  })
}