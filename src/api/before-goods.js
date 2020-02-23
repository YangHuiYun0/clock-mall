import request from "../util/request";

export function getAllGoodsList(params) {
    return request({
      url: '/goods/home/list',
      method: 'get',
      params
    });
  }

  // 加入购物车
  export function joinCart(data) {
    return request({
        url:'/cart',
        method:'post',
        data
    })
  }

  // 购物车列表
 
  export function getCartList() {
    return request({
      url: '/cart/list',
      method: 'get',
    });
  }
  
  // 修改购物车
  export function editCartInfo(id,params) {
    return request({
        url:`/cart/${id}`,
        method:'put',
        params
    })
  }

  export function delCartInfo(id) {
    return request({
        url:`/cart/${id}`,
        method:'delete',
    })
  }

  // 查询热门商品
export function getHotGoodsList(params) {
  return request({
    url: '/goods/hot',
    method: 'get',
    params
  });
}

// 查询品牌商品
export function getBrandGoodsList() {
  return request({
    url: '/goods/brand/list',
    method: 'get',
  });
}