// pages/profile/profile.js
import {decryptPhoneNumber,updateUserInfo} from '../../api'
const app = getApp()
const genderMapping = new Map([
  [1, '男'],
  [2, '女'],
  [3, '未知']
])
Page({

  /** 
   * 页面的初始数据
   */
  data: {
    buttons: [{text: '取消',type:'cancel'}, {text: '确定',type:'ok'}],
    genderMapping,
    dialog:{
      visible:false,
      title:'',
      placeholder:'',
      value:''
    },
    userInfo:null,
    gender:[{
      label:'男',
      value:1
    },{
      label:'女',
      value:2
    }]
  },
  tapDialogButton(e) {
    const {type}=e.detail.item
    if(type==='ok'){
      const{
        field,
        value
      }=this.data.dialog
      let params={
        id:app.globalData.userInfo.id
      }
      params[field]=value
      updateUserInfo(params).then(res=>{
        this.closeDialog()
        this.setData({
          userInfo:Object.assign(this.data.userInfo,params)
        })
      })
    }else{
      this.closeDialog()
    }
},
bindKeyInput: function (e) {
  this.setData({
    dialog:Object.assign(this.data.dialog,{
      value: e.detail.value
    })
  })
},
openEditDialog:function(e){
    // console.log(e)
    const {field,title,value}=e.currentTarget.dataset
    this.setData(
      {
        dialog:{
          field,
          visible:true,
          placeholder:'请输入'+title,
          title:'修改'+title,
          value
        }
      }
    )
  },
  closeDialog:function(){
    this.setData({
      dialog:{visible:false}
    })
  },
  getPhoneNumber (e) {
    const {openId}=app.globalData
    const {encryptedData,iv}=e.detail
    decryptPhoneNumber({
      encryptedData,iv,openId
    }).then(res=>{
      if(res.code===80200){
        app.globalData.userInfo.phoneNumber=res.data.phoneNumber
        this.setData({
          userInfo:Object.assign({phoneNumber:res.data.phoneNumber},this.data.userInfo)
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: app.globalData.userInfo
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
  // onShareAppMessage: function () {

  // }
})