// const baseUrl = 'http://192.168.0.69:8005'
const baseUrl = 'https://manage.bangzhuanwang.com/api'

export const request = ({
  method = 'get',
  url,
  data = {},
  header = {},
  complete
}) => {

  return new Promise(function (resolve, reject) {
    header = Object.assign({
      Authorization: getApp().globalData.token
    })
    wx.request({
      url: baseUrl + url,
      method,
      data,
      header,
      complete,
      success(res) {
        try {
          resolve(res.data);
        } catch (error) {
          reject(error, '运行时错误,请稍后再试')
        }
      },
      fail(err) {
        reject(err)
      }
    })
  })
}