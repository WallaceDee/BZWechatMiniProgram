// pages/needs/needs.js
import {
  getAreaPool,
  getRealmPool,
  deleteFavorite,
  setFavorite
} from '../../api'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    area: [],
    loading: false,
    realm: [],
    realmSortList: [],
    areaSortList: [],
    type: 'realm'
  },
  onTagClick(event) {
    const {
      index,
      type
    } = event.currentTarget.dataset
    this.setData({
      [`${type}[${index}].checked`]: true
    })
    this.data[`${type}SortList`].push(this.data[type][index])
    this.setData({
      [`${type}SortList`]: this.data[`${type}SortList`]
    })
    if (type === 'realm') {
      const realmDrag = this.selectComponent('#realm-drag');
      realmDrag.init();
    } else {
      const areaDrag = this.selectComponent('#area-drag');
      areaDrag.init();
    }
  },
  doSubmit: function () {
    let cityCodes = []
    let realmIds = []
    this.data.areaSortList.map((item, index) => {
      cityCodes.push({
        code: item.code,
        sort: index
      })
    })

    this.data.realmSortList.map((item, index) => {
      realmIds.push({
        realmId: item.id,
        sort: index
      })
    })

    setFavorite({
      cityCodes,
      realmIds
    }).then(res => {
      if (res.code === 80200) {
        app.globalData.userInfo.ownedCities = this.data.areaSortList
        app.globalData.userInfo.ownedRealms = this.data.realmSortList
        app.globalData.hasChangeTags = true
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
  sortEnd(e) {
    console.log("sortEnd", e.detail.listData)
    this.setData({
      listData: e.detail.listData
    });
  },
  change(e) {
    console.log("change", e.detail.listData)
    this.setData({
      realmSortList: e.detail.listData
    })
  },
  itemClick(e) {
    console.log(e);
  },
  deleteItem(e) {
    console.log(e);
    const {
      type
    } = e.currentTarget.dataset
    const {
      id,
      code
    } = e.detail.data
    const list = this.data[`${type}SortList`]
    let deleteIndex = -1
    for (let index = 0; index < list.length; index++) {
      const element = list[index];
      if (type === 'realm' && element.id === id) {
        deleteIndex = index
        break
      }
      if (type === 'area' && element.code === code) {
        deleteIndex = index
        break
      }
    }
    this.data[`${type}SortList`].splice(deleteIndex, 1)
    this.setData({
      [`${type}SortList`]: this.data[`${type}SortList`]
    })
    if (type === 'realm') {
      const realmDrag = this.selectComponent('#realm-drag');
      realmDrag.init();
    } else {
      const areaDrag = this.selectComponent('#area-drag');
      areaDrag.init();
    }
    let recoverIndex = -1
    for (let index = 0; index < this.data[type].length; index++) {
      const element = this.data[type][index];
      if (type === 'realm' && element.id === id) {
        recoverIndex = index
        break
      }
      if (type === 'area' && element.code === code) {
        recoverIndex = index
        break
      }
    }
    console.log([`${type}[${recoverIndex}].checked`])
    this.setData({
      [`${type}[${recoverIndex}].checked`]: false
    })
    console.log(this.data[type][recoverIndex].checked)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {

    this.setData({
      type: options.type,
      loading: true
    })
    let areaRawData = await getAreaPool({
      size: 999
    })
    let realmRawData = await getRealmPool({
      size: 999
    })
    if (areaRawData.code === 80200 && realmRawData.code === 80200) {
      const app = getApp()
      let areas
      let realms
      if (app.globalData.userInfo) {

        let ownedCities = app.globalData.userInfo.ownedCities || []
        let ownedRealms = app.globalData.userInfo.ownedRealms || []
        ownedRealms.map(item => {
          item.title = item.realmName
          item.dragId = item.id
        })
        this.setData({
          realmSortList: ownedRealms
        })
        ownedCities.map(item => {
          item.title = item.name
          item.dragId = item.code
        })
        this.setData({
          areaSortList: ownedCities
        })
        areas = areaRawData.data.records
        realms = realmRawData.data.records
        realms.map(item => {
          item.dragId = item.id
        })

        ownedCities.map(item => {
          for (let index = 0; index < areas.length; index++) {
            if (item.code === areas[index].code) {
              areas[index].checked = true
              break
            }
          }
        })

        ownedRealms.map(item => {
          for (let index = 0; index < realms.length; index++) {
            if (item.id === realms[index].id) {
              realms[index].checked = true
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
      const realmDrag = this.selectComponent('#realm-drag');
      realmDrag.init();
      const areaDrag = this.selectComponent('#area-drag');
      areaDrag.init();
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
  // onShareAppMessage: function () {

  // }
})