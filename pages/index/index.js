// pages/index/index.js
import {
  getArticleList
} from '../../api'
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeTab: {
      realm: 0,
      area: 0
    },
    current: 'realm',
    headerTabs: [{
      label: '领域',
      name: 'realm'
    }, {
      label: '地域',
      name: 'area'
    }],
    tagTabs: {
      realm: [],
      area: [],
    },
    list: {
      realm:[],
      area:[]
    },
    loading: false,
    loaded: false,
    allLoaded: false,
    page: 1,
    size: 20,
    navHeight: 40,
    currentIndex: 0,
    background: ['demo-text-1', 'demo-text-2', 'demo-text-3'],
    indicatorDots: true,
    vertical: false,
    autoplay: false,
    interval: 2000,
    duration: 500,
    currentFilterKeyword: 'filter1'
  },
  onTagTabChange(e) {
    const index = e.detail.index
    if (this.data.current === 'realm') {
      console.log(Object.assign(this.data.activeTab, {
        realm: index
      }))
      this.setData({
        activeTab: Object.assign(this.data.activeTab, {
          realm: index
        })
      })
    } else {
      this.setData({
        activeTab: Object.assign(this.data.activeTab, {
          area: index
        })
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
      url: '../search/search'
    })
  },
  go2Category() {
    wx.navigateTo({
      url: '../category/category'
    })
  },
  catchShareTap() {
    console.log(1)
  },
  go2Article(event) {
    const {
      id
    } = event.currentTarget.dataset
    wx.navigateTo({
      url: `../article/article?id=${id}`
    })
  },
  getArticleList() {
    let currentData=this.data.list[this.data.current]
    let dataIndex=this.data.activeTab[this.data.current]
    let currentTabData=currentData[dataIndex]=currentData[dataIndex]||{data:[],page:1,allLoaded:false,loading:false,loaded:false}
    const {loading,allLoaded} =currentTabData
    if (loading || allLoaded) {
      return false
    }
    currentTabData.loading=true
    this.setData({
      list:this.data.list
    })
    const current=currentTabData.page
    let params = {
      current,
      size: this.data.size
    }
    if (this.data.current === 'realm') {
      params.realmIdsStr = this.data.tagTabs[this.data.current][this.data.activeTab[this.data.current]].id
    } else {
      params.cityCodes = [this.data.tagTabs[this.data.current][this.data.activeTab[this.data.current]].code]
    }
    getArticleList(params).then(res => {
      currentData[dataIndex].loading=false
      currentData[dataIndex].loaded=true
      this.setData({
        list: this.data.list
      })
      if (res.code === 80200) {
        currentData[dataIndex]={
          loaded:true,
          data: currentTabData.data.concat(res.data.records),
          page:currentTabData.page+1
        }
        if (currentData[dataIndex].data.length >= res.data.total || !res.data.records.length) {
            currentData[dataIndex].allLoaded=true
        }
        if(this.data.current==='realm'){
        this.setData({
          list:Object.assign(this.data.list,{
            realm:currentData
          })
        })
      }else{
        this.setData({
          list:Object.assign(this.data.list,{
            area:currentData
          })
        })
      }
      }
    })
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
    if (app.globalData.ready) {
      this.getArticleList()
    } else {
      app.initReadyCallback = res => {
        const {
          ownedRealms,
          ownedCities
        } = app.globalData.profileInfo
        if (ownedRealms.length || ownedCities.length) {
          ownedRealms.map(item => {
            item.title = item.realmName
          })
          ownedCities.map(item => {
            item.title = item.name
          })
          this.setData({
            tagTabs: {
              realm: ownedRealms,
              area: ownedCities
            }
          })
          this.getArticleList()
        }
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