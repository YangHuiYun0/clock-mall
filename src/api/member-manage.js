import request from "../util/request";

// 获取注册会员列表
export function getmemberList(params) {
  return request({
    url: '/user/list',
    method: 'get',
    params
  });
}
// 增加会员
export function addMember(data) {
  return request({
      url:'/user',
      method:'post',
      data
  })
}
// 修改会员
export function editMember(id,data) {
  return request({
      url:'/user/'+id,
      method:'put',
      data
  })
}
// 删除会员
export function delMember(id) {
  return request({
      url:'/user/'+id,
      method:'delete',
  })
}
// 获取会员
export function getMember(id) {
  return request({
      url:'/user/'+id,
      method:'get',
  })
}