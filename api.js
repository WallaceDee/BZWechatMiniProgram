import {request} from './utils/request.js'

export const login = (data) => {
  return request({
    noToken:true,
      url:'/cwLoginInfo/v1/code/login',
      data
  })
}
export const getArticleByArticleNo = (dataStr) => {
  return request({
      noToken:true,
      url:'/cwArticleInfo/v1/number/info?'+dataStr
  })
}

export const getArticle = (data) => {
  return request({
      noToken:true,
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
      noToken:true,
      url:'/addr/cw/enable/city/list',
      data,
      method:'get'
  })
}

export const getRealmPool = (data) => {
  return request({
       noToken:true,
      url:'/cwRealm/console/v1/page',
      data,
      method:'get'
  })
}


export const deleteFavorite= (data) => {
  return request({
      url:'/cwLogin/v1/del/favorite',
      data,
      method:'post'
  })
}


export const setFavorite= (data) => {
  return request({
      url:'/cwLogin/v1/new/my/favorite',
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

export const getBannerList = (data) => {
  return request({
      noToken:true,
      url:'/cwBanner/v1/mini/page',
      data,
      method:'get'
  })
}

export const decryptPhoneNumber = (data) => {
  return request({
      url:'/cwLoginInfo/v1/login/phone/decrypt',
      data,
      method:'get'
  })
}

export const updateUserInfo = (data) => {
  return request({
      url:'/cwLoginInfo/v1/login/update',
      data,
      method:'post'
  })
}

export const sendEmail = (data) => {
  return request({
      url:'/tool/v1/login/send',
      data,
      method:'post'
  })
}

export const collect = (data) => {
  return request({
      url:'/cwLoginArticle/v1/collect',
      data,
      method:'post'
  })
}

export const getRelatedArticles = (data) => {
  return request({
      url:'/cwArticleInfo/v1/related/page',
      data,
      method:'post'
  })
}

export const getCollocationList = (data) => {
  return request({
      url:'/cwLogin/v1/my/favorite',
      data,
      method:'get'
  })
}

export const getSentList = (data) => {
  return request({
      url:'/cwLoginEmail/v1/my/send/list',
      data,
      method:'get'
  })
}

export const getUnlimited = (data) => {
  return request({
      url:'/tool/mini/code',
      data,
      method:'post'
  })
}


export const getHotKeyword = (data) => {
  return request({
      url:'/search/hottest',
      data
  })
}

export const noteKeyword = (data) => {
  return request({
      url:'/search/add',
      data
  })
}

export const getAutoComplete = (data) => {
  return request({
      url:'/search/list',
      data
  })
}

export const setRealm= (data) => {
  return request({
      url:'/cwLoginInfo/v1/login/realm/replace',
      data,
      method:'post'
  })
}
