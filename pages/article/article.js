// pages/article/article.js
const htmlSnip =
`<div class="div_class">
  <h1>Title</h1>
  <p class="p">
    Life is&nbsp;<i>like</i>&nbsp;a box of
    <b>&nbsp;chocolates</b>.
  </p>
</div>
`
Page({

  /**
   * 页面的初始数据
   */
  data: {
    htmlSnip
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
    wx.request({
      url: 'https://manage.bangzhuanwang.com/api//cwArticleInfo/v1/info', //仅为示例，并非真实的接口地址
      data: {
        id: '8b0702e1ecf04a39aa1be4d73622217f'
      },
      success (res) {
        console.log(res.data)
      }
    })
    // https://manage.bangzhuanwang.com/api//cwArticleInfo/v1/info?id=8b0702e1ecf04a39aa1be4d73622217f
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