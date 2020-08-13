// pages/article/article.js
//获取应用实例
const app = getApp()

import {
  getArticle,
  getArticleByArticleNo,
  getRelatedArticles
} from '../../api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: true,
    content: '',
    title: '',
    createTime: '',
    related: []
  },
  onRichTextClick(e) {
    console.log(e)
  },
  go2Article: function (event) {
    const {
      id
    } = event.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/article/article?id=${id}`
    })
  },
  getRelatedArticles(data) {
    getRelatedArticles(data).then(res => {
      if (res.code === 80200) {
        this.setData({
          related: res.data.records
        })
      }
    })
  },
  getArticleByArticleNo: function (articleNo) {
    getArticleByArticleNo(articleNo).then(res => {
      this.getDetailCallbackres(res)
    })
  },
  getArticle: function (id) {
    getArticle({
      id
    }).then(res => {
      this.getDetailCallbackres(res)
    })
  },
  getDetailCallbackres(res) {
    if (res.code === 80200) {
      let {
        content,
        title,
        createTime
      } = res.data
      wx.setNavigationBarTitle({
        title
      })
      content = content.replace(/<img/g, '<img style="max-width:100%;height:auto;display:block;margin:10px 0;"')
      this.setData({
        content,
        title,
        createTime
      })
      this.setData({
          loading: false
        }) |
        this.getRelatedArticles({
          id: res.data.id,
          size: 3
        })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    if (options.scene) {
      const scene = decodeURIComponent(options.scene)
      this.getArticleByArticleNo(scene)
    } else {
      this.getArticle(options.id)
    }
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