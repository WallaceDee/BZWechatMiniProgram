import {
  login,
  getLoginInfo
} from './api'
import {
  watch
} from './utils/util.js'
App({
  globalData: {
    code: '',
    openId: '',
    ready: false,
    statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'],
    userInfo: null,
    token: '',
    loginInfo: null,
    hasChangeTags: false
  },
  getToken() {
    return new Promise((resolve, reject) => {
      if (this.globalData.ready) {
        resolve(this.globalData.token)
      } else {
        watch(this.globalData, 'ready', () => {
          console.log(this.globalData.ready)
          resolve(this.globalData.token)
        })
      }
    })
  },
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        let {
          errMsg,
          code
        } = res
        this.globalData.code = code
        if (errMsg === 'login:ok') {
          console.log(res)
          // 获取用户信息
          wx.getSetting({
            success: res => {
              console.log(res, 'setting')
              if (res.authSetting['scope.userInfo']) {
                // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                wx.getUserInfo({
                  success: res => {
                    // 可以将 res 发送给后台解码出 unionId
                    res.userInfo.nickname = res.userInfo.nickName
                    res.userInfo.sex = res.userInfo.gender
                    res.userInfo.headImg = res.userInfo.avatarUrl
                    const {
                      nickname,
                      sex,
                      headImg,
                      city,
                      province,
                      country
                    } = res.userInfo
                    login({
                      nickname,
                      sex,
                      headImg,
                      city,
                      province,
                      country,
                      code
                    }).then(res => {
                      if (res.code === 80200) {
                        this.globalData.token = 'Bearer ' + res.data['access_token']
                        this.globalData.loginInfo = res.data.loginInfo
                        this.globalData.openId = res.data.loginInfo.openId
                        this.globalData.ready = true
                        getLoginInfo({
                          openId: this.globalData.openId
                        }).then(res => {
                          if (res.code === 80200) {
                            this.globalData.userInfo = res.data
                            if (this.initReadyCallback) {
                              this.initReadyCallback(res)
                            }
                          }
                        })
                      }
                    })
                    // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                    // 所以此处加入 callback 以防止这种情况
                    if (this.userInfoReadyCallback) {
                      this.userInfoReadyCallback(res)
                    }
                  }
                })
              } else {
                this.globalData.ready = true
                if (this.initReadyCallback) {
                  this.initReadyCallback(false)
                }
              }
            }
          })
        }
      }
    })
  }
})