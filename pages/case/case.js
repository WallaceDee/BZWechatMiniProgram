// pages/case/case.js
import {
  getCaseList
} from '../../api'
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
  go2Article(event) {
    const {
      id
    } = event.currentTarget.dataset
    wx.navigateTo({
      url: `../article/article?id=${id}`
    })
  },
  getCaseList(){
    if(this.data.allLoaded||this.data.loading){
      return false
    }
    this.setData({
      loading:true
    })
    getCaseList({
      current:this.data.page,
      size:this.data.size
    }).then(res=>{
      this.setData({
        loaded:true,
        loading:false
      })
      if(res.code===80200){
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
    this.getCaseList()
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
    console.log(this.getTabBar())
    if (typeof this.getTabBar === 'function' &&
    this.getTabBar()) {
    this.getTabBar().setData({
      selected: 1
    })
  }
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