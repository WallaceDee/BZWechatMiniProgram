// const baseUrl = 'http://192.168.0.69:8005'
const baseUrl = 'https://manage.bangzhuanwang.com/api'

const onAppReady = () => {
  return new Promise(function (resolve, reject) {
    let app = getApp()
    const getAppAfterLaunch = setInterval(() => {
      if (!app) {
        app = getApp()
      } else {
        resolve(app)
        clearInterval(getAppAfterLaunch)
      }
    }, 10);
  })
}

export async function request({
  method = 'get',
  url,
  data = {},
  header = {},
  complete,
  noToken=false
}) {
  return new Promise(async function (resolve, reject) {
    wx.showLoading({
      title: '加载中',
    })
    let app=await onAppReady()
    let Authorization = noToken?'':app.globalData.token
    let header = Object.assign({
      Authorization
    })
    wx.request({
      url: baseUrl + url,
      method,
      data,
      header,
      complete,
      success(res) {
        wx.hideLoading()
        try {
          resolve(res.data);
        } catch (error) {
          reject(error, '运行时错误,请稍后再试')
        }
      },
      fail(err) {
        wx.hideLoading()
        reject(err)
      }
    })
  })
}