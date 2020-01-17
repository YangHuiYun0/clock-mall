import request from "../util/request";

// 获取注册会员列表
export function getmemberList(params) {
  return request({
    url: '/user/list',
    method: 'get',
    params
  });
}