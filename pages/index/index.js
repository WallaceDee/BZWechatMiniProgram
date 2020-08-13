// pages/index/index.js
import {
  getArticleList,
  getBannerList,
  getRealmPool,
  getAreaPool
} from '../../api'
import {onShareArticleMessage} from '../../utils/util'
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    keyword:'',
    banners: [{}],
    activeTab: {
      realm: 0,
      area: 0,
      mine:0
    },
    current: 'realm',
    headerTabs: [{
      label: '领域',
      name: 'realm'
    }, {
      label: '地域',
      name: 'area'
    }, {
      label: '精准',
      name: 'mine'
    }],
    tagTabs: {
      realm: [],
      area: [],
      mine:[{
        title:'我的'
      }]
    },
    list: {
      realm: [],
      area: [],
      mine:[]
    },
    navHeight: 40
  },
  onSwiperClick(e) {
    console.log(e)
    const {
      type,
      url,
      articleId
    } = e.currentTarget.dataset
    if (type === 1 || type === 2) {
      wx.navigateTo({
        url: '/pages/article/article?id=' + articleId
      })
    } else if (type === 3) {
      wx.navigateTo({
        url: '/pages/webview/webview?url=' + encodeURIComponent(url)
      })
    }
  },
  onTagTabChange(e) {
    const index = e.detail.index
    const {current}=this.data
    if (current === 'realm') {
      this.setData({
        ['activeTab.realm']:index
      })
    } else if (current === 'area'){
      this.setData({
       ['activeTab.area']:index
      })
    }
    this.getArticleList()
  },
  onHeaderTabChange({
    detail
  }) {
    console.log(detail)
    this.setData({
      current: detail.key
    })
    this.getArticleList()
  },
  go2Search() {
    wx.navigateTo({
      url: '/pages/search/search'
    })
  },
  go2Category() {
    if(app.globalData.userInfo){
    wx.navigateTo({
      url: '/pages/needs/needs?type='+this.data.current
    })
  }else{
    wx.showModal({
      title: '提示',
      showCancel:false,
      content: '您还没有登录呢!',
      confirmText:'去登录',
      success (res) {
        if (res.confirm) {
          wx.switchTab({
            url: '/pages/mine/mine'
          })
        }
      }
    })
  }
  },
  getBannerList() {
    getBannerList().then(res => {
      console.log(res)
      if (res.code === 80200) {
        this.setData({
          banners: res.data.records
        })
      }
    })
  },
  getArticleList() {
    const { current:currentTabName,activeTab,list}=this.data
    let currentData = list[currentTabName]
    let dataIndex = activeTab[currentTabName]
    let currentTabData = currentData[dataIndex] = currentData[dataIndex] || {
      data: [],
      page: 1,
      allLoaded: false,
      loading: false,
      loaded: false
    }
    const {
      loading,
      allLoaded
    } = currentTabData
    if (loading || allLoaded) {
      return false
    }
    currentTabData.loading = true
    this.setData({
      [`list.${currentTabName}[${dataIndex}].loading`]:true
    })
    const current = currentTabData.page
    let params = {
      current,
      size: this.data.size
    }
    if (currentTabName === 'realm') {
      params.realmIdsStr = this.data.tagTabs[currentTabName][activeTab[currentTabName]].id
    } else  if (currentTabName === 'area') {
      params.cityCodes = [this.data.tagTabs[currentTabName][activeTab[currentTabName]].code]
    }
    getArticleList(params).then(res => {
      currentData[dataIndex].loading = false
      currentData[dataIndex].loaded = true
      this.setData({
        [`list.${currentTabName}[${dataIndex}].loading`]:false,
        [`list.${currentTabName}[${dataIndex}].loaded`]:true
      })
      if (res.code === 80200) {
        currentData[dataIndex] = {
          loaded: true,
          data: currentTabData.data.concat(res.data.records),
          page: currentTabData.page + 1
        }
        if (currentData[dataIndex].data.length >= res.data.total || !res.data.records.length) {
          currentData[dataIndex].allLoaded = true
        }
        if (currentTabName === 'realm') {
          this.setData({
            'list.realm':currentData
          })
        } else  if (currentTabName === 'area') {
          this.setData({
            'list.area':currentData
          })
        } else {
          this.setData({
            'list.mine':currentData
          })
        }
      }
    })
  },
  init: async function () {
    this.getBannerList()
    var ownedRealms=[]
    var ownedCities=[]
    if (app.globalData.userInfo) {
      ownedRealms = app.globalData.userInfo.ownedRealms
      ownedCities = app.globalData.userInfo.ownedCities
    }
    
    if(!ownedRealms.length){
      let tempRawData = await getRealmPool()
      ownedRealms = tempRawData.data.records
    }
    if(!ownedCities.length){
      let tempRawData = await getAreaPool()
      ownedCities = tempRawData.data.records
    }
      ownedRealms.map(item => {
        item.title = item.realmName
      })
      ownedCities.map(item => {
        item.title = item.name
      })
      this.setData({
        'tagTabs.realm':ownedRealms,
        'tagTabs.area':ownedCities
      })
      this.getArticleList()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.ready) {
      this.init()
    } else {
      app.initReadyCallback = res => {
        this.init()
      }
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
    if(app.globalData.hasChangeTags){
      app.globalData.hasChangeTags=false
      var ownedRealms = app.globalData.userInfo.ownedRealms
      var ownedCities = app.globalData.userInfo.ownedCities
      if (ownedRealms.length || ownedCities.length) {
        ownedRealms.map(item => {
          item.title = item.realmName
        })
        ownedCities.map(item => {
          item.title = item.name
        })
        this.setData({
          list:{
            realm: [],
            area: []
          },
          tagTabs: {
            realm: ownedRealms,
            area: ownedCities
          }
        })
        this.getArticleList()
      }
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
  onShareAppMessage:onShareArticleMessage
})