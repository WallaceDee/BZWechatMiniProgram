// pages/needs/needs.js
import { getAreaPool,getRealmPool,setFavorite } from '../../api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    area:[],
    realm:[],
    loading:false
  },
  onChange(event){
    const {detail} = event
    const {type}=event.currentTarget.dataset
    this.setData({
        [`${type}[${event.detail.name}].checked`] : detail.checked
    })
  },
  doSubmit:function(){
    let cityCodes=[]
    let realmIds=[]
    this.data.area.filter(item=>{
      return item.checked
    }).map(item=>{
      cityCodes.push(item.code)
    })
    this.data.realm.filter(item=>{
      return item.checked
    }).map(item=>{
      realmIds.push(item.id)
    })
    setFavorite({
      cityCodes,
      realmIds
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:async function (options) {
    this.setData({
      loading:true
    })
    let areaRawData=await getAreaPool({
      size:999
    })
    let realmRawData=await getRealmPool({
      size:999
    })
    if(areaRawData.code===80200&&realmRawData.code){
      this.setData({
        loading:false,
        area:areaRawData.data.records,
        realm:realmRawData.data.records
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