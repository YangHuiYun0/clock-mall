import request from "../util/request";
// 退货原因列表
export function getSaleCauseList(params) {
  return request({
    url: '/cause/list',
    method: 'get',
    params
  });
}
//增加退货原因
export function addCauseInfo(id,data) {
  return request({
    url: '/cause',
    method: 'post',
    data
  });
}

//修改退货原因
export function updateCauseInfo(id,data) {
  return request({
    url: '/cause/'+id,
    method: 'put',
    data
  });
}



//删除退货原因
export function delCauseInfo(id) {
  return request({
    url: `/cause/${id}`,
    method: 'delete'
  });
}

//获取品牌信息
export function getCauseInfo(id) {
  return request({
    url: `/cause/${id}`,
    method: 'get'
  });
}