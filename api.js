import {request} from './utils/request.js'

export const login = (data) => {
  return request({
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
