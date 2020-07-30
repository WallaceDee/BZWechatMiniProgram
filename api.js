import {request} from './utils/request.js'

export const login = (data) => {
  return request({
    noToken:true,
      url:'/cwLoginInfo/v1/code/login',
      data
  })
}

export const getArticle = (data) => {
  return request({
      url:'/cwArticleInfo/v1/info',
      data
  })
}

export const getLoginInfo = (data) => {
  return request({
      url:'/cwLoginInfo/v1/open/login/info',
      data
  })
}

export const getArticleList = (data) => {
  return request({
      url:'/cwArticleInfo/v1/page',
      data,
      method:'post'
  })
}

export const getAreaPool = (data) => {
  return request({
      url:'/addr/cw/enable/city/list',
      data,
      method:'get'
  })
}

export const getRealmPool = (data) => {
  return request({
      url:'/cwRealm/console/v1/page',
      data,
      method:'get'
  })
}

export const setFavorite= (data) => {
  return request({
      url:'/cwLogin/v1/my/favorite',
      data,
      method:'post'
  })
}

export const getCaseList = (data) => {
  return request({
      url:'/cwArticleInfo/v1/case/page',
      data,
      method:'post'
  })
}


