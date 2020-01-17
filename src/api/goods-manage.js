import request from "../util/request";

export function getBrandList(params) {
  return request({
    url: '/brand/list',
    method: 'get',
    params
  });
}

//增加品牌商
export function addBrandInfo(id,data) {
  return request({
    url: '/brand',
    method: 'post',
    data
  });
}

//修改品牌商
export function updateBrandInfo(id,data) {
  return request({
    url: '/brand/'+id,
    method: 'put',
    data
  });
}

//删除品牌商
export function delBrandInfo(id) {
  return request({
    url: `/brand/${id}`,
    method: 'delete'
  });
}

//获取品牌信息
export function getBrandInfo(id) {
  return request({
    url: `/brand/${id}`,
    method: 'get'
  });
}

//获取类别列表
export function getCategoryList() {
  return request({
    url: `/category/list`,
    method: 'get'
  });
}

//删除商品类别
export function delCategoryInfo(id) {
  return request({
      url:'/category/'+id,
      method:'delete',
  })
}
// 增加商品类别
export function addCategoryInfo(data) {
  return request({
      url:'/category',
      method:'post',
      data
  })
}
// 获取商品类别详情
export function getCategoryInfo(id) {
  return request({
      url:`/category/${id}`,
      method:'get',
  })
}
//编辑商品类别
export function updateCategoryInfo(id,data) {
  return request({
      url:`/category/${id}`,
      method:'put',
      data
  })
}
//查询商品类别子节点列表
export function getChildrenTypeList(code) {
  return request({
      url:`/category/children/${code}`,
      method:'get',
  })
}
