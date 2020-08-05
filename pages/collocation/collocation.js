// pages/collocation/collocation.js
import { getCollocationList } from '../../api'
import {onShareArticleMessage} from '../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    allLoaded:false,
    loaded:false,
    loading:false,
    page:1,
    size:20
  },
  getCollocationList(){
    if(this.data.allLoaded||this.data.loading){
      return false
    }
    this.setData({
      loading:true
    })
    getCollocationList({
      current:this.data.page,
      size:this.data.size
    }).then(res=>{
      this.setData({
        loaded:true,
        loading:false
      })
      if(res.code===80200){
        res.data.records.map(item=>{
          item.checked=true
        })
        this.setData({
          list:this.data.list.concat(res.data.records),
          page:this.data.page++
        })
        wx.nextTick(() => {
          if(this.data.list.length>=res.data.total||!res.data.records.length){
            this.setData({
              allLoaded:true
            })
          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCollocationList()
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
  onShareAppMessage:onShareArticleMessage
})