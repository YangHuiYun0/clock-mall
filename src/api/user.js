import request from "../util/request";

export function getAddressList() {
  return request({
    url: '/address/list',
    method: 'get',
  });
}

//增加收货地址商
export function addAddressInfo(id,data) {
  return request({
    url: '/address',
    method: 'post',
    data
  });
}

//修改收货地址商
export function editAddressInfo(id,data) {
  return request({
    url: '/address/'+id,
    method: 'put',
    data
  });
}

//删除收货地址商
export function delAddressInfo(id) {
  return request({
    url: `/address/${id}`,
    method: 'delete'
  });
}

//获取收货地址信息
export function getAddressInfo(id) {
  return request({
    url: `/address/${id}`,
    method: 'get'
  });
}

// 修改默认地址
export function editAddressDefault(id) {
  return request({
    url: '/address/default/'+id,
    method: 'put',
  });
}

// 提交订单
export function submitOrdersInfo (data) {
  return request({
    url: '/orders',
    method: 'post',
    data
  });
}

  //我的订单
  export function getMyOrdersList(params) {
    return request({
      url: '/orders/my',
      method: 'get',
      params
    });
  }

  // 修改订单状态
  export function editOrderStatus(id,params) {
    return request({
      url: '/orders/'+id,
      method: 'put',
      params
    });
  }

  // 删除订单
  export function delOrderInfo(id) {
    return request({
      url: '/orders/'+id,
      method: 'delete',
    });
  }

  // 更改会员头像
  export function changeUserImg (data) {
    return request({
      url: '/user/upload',
      method: 'post',
      data
    });
  }
