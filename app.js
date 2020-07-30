import {login,getLoginInfo} from './api'
import {watch } from './utils/util.js'
App({
  globalData: {
    ready:false,
    statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'],
    userInfo: null,
    token:'',
    loginInfo:null,
    profileInfo:null
  },
  getToken(){
    return new Promise((resolve,reject)=>{
        if(this.globalData.ready){
          resolve(this.globalData.token)
        }else{
         watch(this.globalData,'ready',()=>{
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
                    this.globalData.userInfo = res.userInfo
                    res.userInfo.nickname=res.userInfo.nickName
                    login({
                      ...res.userInfo,
                      code
                    }).then(res=>{
                      if(res.code===80200){
                        this.globalData.token='Bearer '+res.data['access_token']
                        this.globalData.loginInfo=res.data.loginInfo
                        this.globalData.ready=true
                        getLoginInfo({
                          openId:res.data.loginInfo.openId
                        }).then(res=>{
                          if(res.code===80200){
                            this.globalData.profileInfo=res.data
                            if (this.initReadyCallback) {
                              this.initReadyCallback(res)
                            }
                            const {ownedRealms,ownedCities}=res.data
                            if(!ownedRealms.length&&!ownedCities.length){
                              wx.navigateTo({
                                url:'/pages/needs/needs',  //跳转页面的路径，可带参数 ？隔开，不同参数用 & 分隔；相对路径，不需要.wxml后缀
                                success:function(){}        //成功后的回调；
                              })
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
              }else{
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