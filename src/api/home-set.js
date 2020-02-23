import request from "../util/request";

export function getBannerList(params) {
  return request({
    url: '/banner/list',
    method: 'get',
    params
  });
}
//增加banner
export function addBannerInfo(id,data) {
  return request({
      url:'/banner',
      method:'post',
      data
  })
}
// 删除banner
export function delBannerInfo(id) {
  return request({
      url:`/banner/${id}`,
      method:'delete',
  })
}
// 获取banner
export function getBannerInfo(id) {
  return request({
      url:'/banner/'+id,
      method:'get',
  })
}
// 修改banner
export function editBannerInfo(id,data) {
  return request({
      url:`/banner/${id}`,
      method:'put',
      data
  })
}


// 上传图片
export function getImageUrl(data) {
  return request({
    url: '/banner/upload',
    method: 'post',
    data
  });
}

