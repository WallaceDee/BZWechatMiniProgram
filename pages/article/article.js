// pages/article/article.js
//获取应用实例
const app = getApp()

import {
  getArticle
} from '../../api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading:true,
    htmlSnip:'',
    title:'',
    createTime:''
  },
  getArticle: function (id) {
    getArticle({
      id
    }).then(res=>{
      if(res.code===80200){
        const {content,title,createTime}=res.data
        this.setData({
          htmlSnip:res.data.content,
          title,
          createTime
        })
        this.setData({
          loading:false
        })
        wx.hideLoading()
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     console.log(options)
     this.getArticle(options.id)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // wx.showLoading({
    //   title: '加载中',
    //   mask:true
    // })
    // if (app.globalData.ready) {
    //   this.getArticle()
    // } else {
    //   app.initReadyCallback = res => {
    //     this.getArticle()
    //   }
    // }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})