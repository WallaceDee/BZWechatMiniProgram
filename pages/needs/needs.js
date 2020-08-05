// pages/needs/needs.js
import {
  getAreaPool,
  getRealmPool,
  setFavorite
} from '../../api'
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    area: [],
    realm: [],
    loading: false
  },
  onChange(event) {
    const {
      detail
    } = event
    const {
      type
    } = event.currentTarget.dataset
    this.setData({
      [`${type}[${event.detail.name}].checked`]: detail.checked
    })
  },
  doSubmit: function () {
    let cityCodes = []
    let realmIds = []
    this.data.area.filter(item => {
      return item.checked
    }).map(item => {
      cityCodes.push(item.code)
    })
    this.data.realm.filter(item => {
      return item.checked
    }).map(item => {
      realmIds.push(item.id)
    })
    if(!cityCodes.length||!realmIds.length){
      wx.showToast({
        title: '请选择一个或以上领域或地域',
        icon: 'none',
        duration: 2000
      })
      return false
    }
    setFavorite({
      cityCodes,
      realmIds
    }).then(res=>{
      if(res.code===80200){
        app.globalData.userInfo.ownedCities=this.data.area.filter(item => {
          return item.checked
        })
        app.globalData.userInfo.ownedRealms=this.data.realm.filter(item => {
          return item.checked
        })
        app.globalData.hasChangeTags=true
        wx.navigateBack({
          delta: 1
        })
        wx.showToast({
          title: '设置成功',
          icon: 'success',
          duration: 2000
        })

      }
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    this.setData({
      loading: true
    })
    let areaRawData = await getAreaPool({
      size: 999
    })
    let realmRawData = await getRealmPool({
      size: 999
    })
    if (areaRawData.code === 80200 && realmRawData.code === 80200) {
      const app=getApp()
      let areas
      let realms
      if(app.globalData.userInfo){
        let ownedCities=app.globalData.userInfo.ownedCities||[]
        let ownedRealms=app.globalData.userInfo.ownedRealms||[] 

        areas=areaRawData.data.records
        realms=realmRawData.data.records
        ownedCities.map(item=>{
              for(let index=0;index<areas.length;index++){
                if(item.code===areas[index].code){
                  areas[index].checked=true
                  break
                }
              }
          })

          ownedRealms.map(item=>{
            for(let index=0;index<realms.length;index++){
              if(item.id===realms[index].id){
                realms[index].checked=true
                break
              }
            }
        })
      }

      this.setData({
        loading: false,
        area: areas,
        realm: realms
      })

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