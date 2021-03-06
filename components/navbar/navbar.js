// components/navbar/navbar.js
const App = getApp()
Component({
  /**
  * 启用插槽
  */
  options: {
    multipleSlots: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: ''
    },
    custom: {
      type: Boolean,
      value: false
    },
    back: {
      type: Boolean,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    statusBarHeight: App.globalData.statusBarHeight,
    height: 40
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onBackClick() {
      this.triggerEvent('back', {}, {})
    }
  },
  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () {
      let systemInfo = wx.getSystemInfoSync()
      let rect = wx.getMenuButtonBoundingClientRect ? wx.getMenuButtonBoundingClientRect() : null; //胶囊按钮位置信息
      this.height = (function () { //导航栏高度
        let gap = rect.top - systemInfo.statusBarHeight; //动态计算每台手机状态栏到胶囊按钮间距
        return 2 * gap + rect.height;
      })();
      this.triggerEvent('onNavBarReady', this.height)
    },
    hide: function () { },
    resize: function () { },
  },
})
