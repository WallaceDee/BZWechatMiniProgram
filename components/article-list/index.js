// components/article-list/index.js
import {
  sendEmail,
  collect
} from '../../api'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list: {
      type: Array,
      value: []
    },
    isTree: {
      type: Boolean,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    userInfo: {},
    posterVisible: false,
    imgData: {
      width:640,
      height:600
    },
    article:{
      articleNo:'',
      title:'',
      cover:''
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    closePoster() {
      this.data.posterVisible = false
      this.setData({
        posterVisible: false
      })
    },
    openPoster(e) {
      const app = getApp()
      const {
        articleNo,
        title,
        cover
      }=e.currentTarget.dataset
      console.log(app.globalData.userInfo)
      this.setData({
        userInfo: app.globalData.userInfo,
        posterVisible: true,
        article:{
          articleNo,
          title,
          cover
        }
      })
    },
    collect(e) {
      const app = getApp()
      const {
        articleId,
        sectionIndex,
        itemIndex,
        status
      } = e.currentTarget.dataset

      if (app.globalData.userInfo) {
        collect({
          articleId
        }).then(res => {
          if (res.code === 80200) {
            if (this.data.isTree) {
              this.data.list[sectionIndex].children[itemIndex].checked = !status
            } else {
              this.data.list.splice(itemIndex, 1)
            }
            this.setData({
              list: this.data.list
            })
            wx.showToast({
              title: (status ? '取消' : '') + '收藏成功',
              icon: 'success',
              duration: 2000
            })
          } else {
            wx.showToast({
              title: res.msg,
              icon: 'none',
              duration: 2000
            })
          }
        })
      } else {
        this.noLoginModal()
      }

    },
    noLoginModal() {
      wx.showModal({
        title: '提示',
        content: '您还没有登录呢？',
        confirmText: '去登录',
        success(res) {
          if (res.confirm) {
            wx.switchTab({
              url: '/pages/mine/mine'
            })
          }
        }
      })
    },
    sendEmail(e) {
      const app = getApp()
      const {
        articleId
      } = e.currentTarget.dataset
      if (app.globalData.userInfo) {
        const email = app.globalData.userInfo.accountEmail
        if (email) {
          sendEmail({
            articleId
          }).then(res => {
            if (res.code === 80200) {
              wx.showToast({
                title: '发送成功',
                icon: 'success',
                duration: 2000
              })
            } else {
              wx.showToast({
                title: '发送失败,请联系客服',
                icon: 'none',
                duration: 2000
              })
            }
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '您还没有设置邮箱呢？',
            confirmText: '去设置',
            success(res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '/pages/profile/profile'
                })
              }
            }
          })
        }
      } else {
        this.noLoginModal()
      }
    },
    catchShareTap: function () {
      console.log(2)
    },
    go2Article: function (event) {
      const {
        id
      } = event.currentTarget.dataset
      wx.navigateTo({
        url: `/pages/article/article?id=${id}`
      })
    }
  }
})