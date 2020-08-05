import {
  getUnlimited
} from '../../api'
const app = getApp();

const fsm = wx.getFileSystemManager();
const FILE_BASE_NAME = 'tmp_base64src'; //自定义文件名
 
function base64src(base64data, callback) {
  
  const [, format, bodyData] = /data:image\/(\w+);base64,(.*)/.exec(base64data) || [];
  if (!format) {
    return (new Error('ERROR_BASE64SRC_PARSE'));
  }
  const time = new Date().getTime(); //自定义文件名
  const filePath = `${wx.env.USER_DATA_PATH}/${time}.${format}`;
  const buffer = wx.base64ToArrayBuffer(bodyData);

  fsm.writeFile({
    filePath,
    data: buffer,
    encoding: 'binary',
    success() {
      callback(filePath);
    },
    fail() {
      return (new Error('ERROR_BASE64SRC_WRITE'));
    },
  });
};
function getImageInfo(url) {
  return new Promise((resolve, reject) => {
    wx.getImageInfo({
      src: url,
      success: resolve,
      fail: reject,
    })
  })
}

// 用户授权检查
const checkPermission = type => {
  return new Promise((resolve, reject) => {
    const type = 'scope.writePhotosAlbum'
    wx.getSetting({
      success(getRes) {
        const setting = getRes.authSetting;
        if (setting[type] === false) {
          wx.showModal({
            title: '温馨提示',
            content: '请开启保存到相册权限，开启后请重新生成海报',
            success: res => {
              wx.openSetting({
                success(openRes) {
                  if (openRes.authSetting[type] === true) {
                    resolve()
                  }
                }
              });
            }
          })
        } else if (setting[type] === true) {
          //如果已有授权直接执行对应动作
          resolve()
        } else {
          //如果未授权，直接执行对应动作，会自动查询授权
          resolve()
        }
      }
    })
  })
}



Component({
  options: {
    multipleSlots: true,
    // 在组件定义时的选项中启用多slot支持
    addGlobalClass: true
  },
  properties: {
    article:{
      type:Object,
      value:{}
    },
    userInfo:{
      type:Object,
      value:{}
    },
    imgData: {
      type: Object,
      value: {}
    },
    extClass: {
      // 弹窗 class
      type: String,
      value: ''
    },
    maskClosable: {
      type: Boolean,
      value: true
    },
    mask: {
      // 是否需要 遮罩层
      type: Boolean,
      value: true
    },
    show: {
      // 是否开启弹窗
      type: Boolean,
      value: false,
      observer(value) {
        if (value) {
          setTimeout(() => {
            this.initData(value)
           
          }, 100)
        }
      }
    }
  },
  data: {
    canvasWidth: 375,
    canvasHeight: 667,
    loading:false
  },

  ready() {

  },

  methods: {
    // // 数据初始化
    saveImage() {
      console.log(this)
      wx.canvasToTempFilePath({
        canvasId: 'image',
        fileType: 'jpg',
        success(res) {
          checkPermission('writePhotosAlbum').then(() => {
            wx.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
              success(res) {
                // wx.showModal('保存至相册', '图片成功保存至本地相册', false)
                wx.showToast({
                  title: '已保存相册，快去分享吧',
                  icon: 'none',
                  duration: 2000
                })
              }
            })
          })
        },
        fail(err) {
          console.log(err)
          // util.hideToast()
          // util.showModal('错误提示', err, false)
        }
      }, this)
    },
    initData(value) {
      this.setData({loading:true})
      let {
        imgData,
        userInfo
      } = this.data
      let {
        cover,
        title,
        articleNo
      } = this.data.article
      console.log({
        cover,
        title,
        articleNo
      })
      let canvasWidth = parseInt(imgData.width / 2) || 375
      let canvasHeight = parseInt(imgData.height / 2) || 667

      this.setData({
        canvasWidth,
        canvasHeight
      })

      const context = wx.createCanvasContext('image', this)

      const backgroundPromise = getImageInfo(cover)
      const avatarPromise = getImageInfo(userInfo.headImg)
      const unlimitedPromise=new Promise((resolve, reject) => {
          getUnlimited({
            // page: 'pages/article/article',
            scene: 'articleNo=' + articleNo,
            width: 280,
            auto_color: true,
            is_hyaline: true
          }).then(res => {
            base64src("data:image/png;base64," +res.data,(path)=>{
              console.log()
              wx.getImageInfo({
                src: path,
                success: resolve,
                fail: reject,
              })
            })
          })
        })

      Promise.all([backgroundPromise,avatarPromise,unlimitedPromise])
      .then(([bg,avatar,unlimited]) => {

        console.log(bg,avatar,unlimited)
        console.log(userInfo)
        context.fillStyle = "#fff";
        context.fillRect(0, 0, canvasWidth, canvasHeight);
        let coverHeight = canvasWidth * bg.height / bg.width
        context.drawImage(bg.path, 0, 0, canvasWidth, coverHeight)
        context.fillStyle = "#fff";
        context.fillRect(0, canvasHeight * .48, canvasWidth, canvasHeight * .48);
        context.fillStyle = "#000";

        let fontSize = 16
        const padding = 15
        const maxLine = 2
        context.font = `normal ${fontSize}px Microsoft YaHei`;
        const textMaxWidth = canvasWidth - padding * 2
        let numberPerLine = parseInt((textMaxWidth) / fontSize)
        let line = title.length / numberPerLine
        for (let index = 0; index <= maxLine; index++) {
          console.log(index)
          let text = title.substring(index * numberPerLine, numberPerLine)
          if (line >= maxLine && index === maxLine) {
            text = text.substr(0, text.length - 2) + '...'
          }
          context.fillText(text, padding, canvasHeight * .58 + index * 12, textMaxWidth);
        }
        context.fillStyle = "#e8e8e8";
        context.fillRect(padding, canvasHeight * .72, textMaxWidth, 1);

        const avatarInfo = {
          size: 30,
          left: 90,
          top: canvasHeight * .77
        }
        let r = parseInt(avatarInfo.size / 2) // 半径
        context.save()
        let d = 2 * r
        let cx = avatarInfo.left + r
        let cy = avatarInfo.top + r
        context.arc(cx, cy, r, 0, 2 * Math.PI)
        context.clip()
        context.drawImage(avatar.path, avatarInfo.left, avatarInfo.top, d, d)
        context.restore()

        fontSize = 12
        context.font = `normal ${fontSize}px Microsoft YaHei`;
        context.fillStyle = "#000";
        context.fillText(userInfo.nickname, 130, canvasHeight * .82);
        context.fillStyle = "#6E6E6E";
        context.fillText('正在阅读这篇文章', 175, canvasHeight * .82);
        fontSize = 10
        context.font = `normal ${fontSize}px Microsoft YaHei`;
        context.fillText('识别小程序码，进入 　　　　　　　　 阅读全文', 90, canvasHeight * .94);
        context.fillStyle = "#2C7BD2";
        context.fillText('专利创新推送中心', 182, canvasHeight * .94);
        console.log(articleNo)

          context.drawImage(unlimited.path, padding, canvasHeight * .74, 65, 65)

          context.draw()
          this.setData({
            loading:false
          });
         setTimeout(()=>{
          this.saveImage(value)
         },500)
      })
    },
    close() {
      const data = this.data;
      if (!data.maskClosable) return;
      this.setData({
        show: false,
        loading:false
      });
      this.triggerEvent('close', {}, {});
    },

    stopEvent() {}

  }
});