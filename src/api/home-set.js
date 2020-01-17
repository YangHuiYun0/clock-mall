import request from "../util/request";

export function getBannerList(params) {
  return request({
    url: '/banner/list',
    method: 'get',
    params
  });
}