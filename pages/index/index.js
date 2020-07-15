// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // drawerVisible: false,
    navHeight: 40,
    current: 'tab1',
    currentIndex: 0,
    background: ['demo-text-1', 'demo-text-2', 'demo-text-3'],
    indicatorDots: true,
    vertical: false,
    autoplay: false,
    interval: 2000,
    duration: 500,
    currentFilterKeyword: 'filter1'
  },
  go2Search(){
    wx.navigateTo({
      url: '../search/search'
    })
  },
  go2Category(){
    wx.navigateTo({
      url: '../category/category'
    })
  },
  // handleDrawerVisible() {
  //   this.setData({
  //     drawerVisible: !this.data.drawerVisible
  //   });
  // },
  handleChange({
    detail
  }) {
    this.setData({
      current: detail.key
    });
  },
  handleFilterChange({
    detail
  }) {
    this.setData({
      currentFilterKeyword: detail.key
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
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