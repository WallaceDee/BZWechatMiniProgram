// pages/search/search.js
import {debounce} from '../../utils/util'
import {
  getArticleList,
  getHotKeyword
} from '../../api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    keyword:'',
    hotKeywords:[]
  },
  onSearchInput:debounce(
    function(event){
      const  {value, cursor, keyCode}=event.detail
      console.log({value, cursor, keyCode})




    },500,false
  ),
  onCancel:function(){
    wx.navigateBack({
      delta: 1
    })
  },
  getHotKeyword(){
    getHotKeyword().then(res=>{
      console.log(res)
      if(res.code===80200){
        this.setData({
          hotKeywords:res.data
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getHotKeyword()
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
  onShareAppMessage: function () {

  }
})