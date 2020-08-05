// pages/mine/mine.js
import {login,getLoginInfo} from '../../api'
//获取应用实例
const app = getApp()

Page({
  data: {
    loading:false,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  noLoginModal(){
    wx.showModal({
      title: '提示',
      showCancel:false,
      content: '您还没有登录呢!',
      confirmText:'去登录',
      success (res) {
        if (res.confirm) {

        }
      }
    })
  },
  go2Profile:function(){
    if(!app.globalData.userInfo){
      this.noLoginModal()
      return false
    }
    wx.navigateTo({
      url: '../profile/profile'
    })
  },
  go2Collocation: function() {
    if(!app.globalData.userInfo){
      this.noLoginModal()
      return false
    }
    wx.navigateTo({
      url: '../collocation/collocation'
    })
  },
  go2Sent: function() {
    if(!app.globalData.userInfo){
      this.noLoginModal()
      return false
    }
    wx.navigateTo({
      url: '../sent/sent'
    })
  },

  onLoad: function () {
    if (app.globalData.ready) {
      if(app.globalData.userInfo){
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    }
    } else if (this.data.canIUse){

      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.initReadyCallback = res => {
        console.log(res)
        if(res.code===80200){
        this.setData({
          loading:false,
          userInfo: res.data,
          hasUserInfo: true
        })
      }
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    this.setData({
      loading:true
    })
    if( e.detail.userInfo){
         let temp=e.detail.userInfo
         temp.nickname=temp.nickName
         temp.sex =temp.gender
         temp.headImg =temp.avatarUrl  
         const {
           nickname,
           sex,
           headImg,
           city,
           province,
           country
         }= temp
         login({
           nickname,
           sex,
           headImg,
           city,
           province,
           country,
           code:app.globalData.code
         }).then(res=>{
           if(res.code===80200){
             app.globalData.token='Bearer '+res.data['access_token']
             app.globalData.loginInfo=res.data.loginInfo
             app.globalData.ready=true
             getLoginInfo({
               openId:res.data.loginInfo.openId
             }).then(res=>{
               if(res.code===80200){
                app.globalData.userInfo=res.data
                this.setData({
                  loading:false,
                  userInfo:res.data,
                  hasUserInfo:true
                })
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
    }
  },
  test(){
    console.log(2)
  }
})
