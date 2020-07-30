const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//监听属性值函数
const watch=(obj,val,method)=>{
  Object.defineProperty(obj,val,{
    configurable:true,
    enumerable:true,
    set:function(nval){
        val = nval;
        method(nval)
    },
    get:function(){
      return val
    }
  })
}
module.exports = {
  formatTime,
  watch
}
