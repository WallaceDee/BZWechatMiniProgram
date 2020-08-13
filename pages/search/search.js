// pages/search/search.js
import {
  debounce
} from '../../utils/util'
import {
  getArticleList,
  getHotKeyword,
  noteKeyword,
  getAutoComplete
} from '../../api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    autoComplete:[],
    history: [],
    page: 1,
    size: 20,
    loaded: false,
    allLoaded: false,
    loading: false,
    keyword: '',
    hotKeywords: [],
    result: [],
    searching: false
  },
  onSearchInput: debounce(
    function (event) {
      const {
        value,
        cursor,
        keyCode
      } = event.detail
 
      this.setData({
        keyword: value
      })
      if (!value) {
        this.setData({
          autoComplete:[],
          searching: false
        })
      }
      this.getAutoComplete(value)

    }, 500, false
  ),
  getAutoComplete(searchStr){
    if(!searchStr){
      return false
    }
    getAutoComplete({
      searchStr
    }).then(res=>{
      if(res.code===80200){
        this.setData({
          autoComplete:res.data.list
        })
      }
    })
  },
  go2Article: function (event) {
    const {
      id
    } = event.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/article/article?id=${id}`
    })
  },
  onHotSearchOrHistoryClick(e){
    const {keyword}=e.currentTarget.dataset
    this.setData({
      keyword,
      autoComplete:[]
    })
    this.onSearch()
  },
  clearKeyword(){
    this.setData({
      searching:false,
      autoComplete:[],
      keyword:''
    })
  },
  deleteHistory(){
    wx.setStorageSync('history', [])
    this.setData({
      history:[]
    })
  },
  onSearch: function (e) {
    let keyword = this.data.keyword
    if (!keyword) {
      return false
    }
    let history = wx.getStorageSync('history') || []
    if (history.indexOf(keyword) === -1) {
      history.unshift(keyword)
      if(history.length>20){
         history.pop() 
      }
      wx.setStorageSync('history', history)
      this.setData({
        history
      })
    }
    this.noteKeyword(keyword)

    this.setData({
      page: 1,
      result: [],
      allLoaded: false,
      loaded: false,
      searching: true
    })
    this.getArticleList()
  },
  noteKeyword(searchStr){
    noteKeyword({
      searchStr
    })
  },
  getArticleList() {
    if (this.data.allLoaded || this.data.loading) {
      return false
    }
    this.setData({
      loading: true
    })
    getArticleList({
      current: this.data.page,
      size: this.data.size,
      title: this.data.keyword
    }).then(res => {
      this.setData({
        loaded: true,
        loading: false
      })
      if (res.code === 80200) {
        this.setData({
          result: this.data.result.concat(res.data.records),
          page: this.data.page++
        })
        wx.nextTick(() => {
          if (this.data.result.length >= res.data.total || !res.data.records.length) {
            this.setData({
              allLoaded: true
            })
          }
        })
      }
    })
  },
  getHotKeyword() {
    getHotKeyword().then(res => {
      console.log(res)
      if (res.code === 80200) {
        this.setData({
          hotKeywords: res.data
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getHotKeyword()
    wx.getStorage({
      key: 'history',
      success: res => {
        this.setData({
          history: res.data
        })
      }
    })
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