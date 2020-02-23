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

// 查询订单列表
export function getOrdersList(params) {
  return request({
    url: '/orders/list',
    method: 'get',
    params
  });
}

// 查看订单详情

export function getOrdersInfo(id) {
  return request({
    url: '/orders/info/'+id,
    method: 'get',
  });
}

// 填写快递单号
export function setDeliveryCode(id,params) {
  return request({
    url: '/orders/delivery/'+id,
    method: 'put',
    params
  });
}

// 退货原因选择
export function setRefundCause(id,params) {
  return request({
    url: '/orders/cancel/'+id,
    method: 'put',
    params
  });
}