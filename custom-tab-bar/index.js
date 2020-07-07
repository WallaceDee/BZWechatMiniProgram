Component({
  data: {
    selected: 0,
    color: "#7A7E83",
    selectedColor: "#44818F",
    list: [{
      pagePath: "/pages/index/index",
      iconPath: "/image/icon_home.svg",
      selectedIconPath: "/image/icon_home_HL.svg",
      text: "首页"
    }, {
      pagePath: "/pages/case/case",
      iconPath: "/image/icon_case.svg",
      selectedIconPath: "/image/icon_case_HL.svg",
      text: "案件"
    }, {
      pagePath: "/pages/mine/mine",
      iconPath: "/image/icon_mine.svg",
      selectedIconPath: "/image/icon_mine_HL.svg",
      text: "我的"
    }]
  },
  attached() {
  },
  methods: {
    switchTab(e) {
      console.log(e)
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({url})
      this.setData({
        selected: data.index
      })
    }
  }
})