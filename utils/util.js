const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const onShareArticleMessage = function ({
  from,
  target
}) {
  if (from === 'button') {
    const {
      title,
      articleId,
      cover
    } = target.dataset
    return {
      title,
      path: '/pages/article/article?id=' + articleId,
      imageUrl: cover ? cover : '/image/default_share_cover.png'
    }
  } else {
    return {
      title: '专利创新推送中心',
      path: '/pages/index/index',
      imageUrl: '/image/default_share_cover.png'
    }
  }
}
Date.prototype.format = function (fmt) {
  let o = {
    'M+': this.getMonth() + 1,
    'd+': this.getDate(),
    'h+': this.getHours(),
    'm+': this.getMinutes(),
    's+': this.getSeconds(),
    'q+': Math.floor((this.getMonth() + 3) / 3),
    'S': this.getMilliseconds()
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return fmt
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//监听属性值函数
const watch = (obj, val, method) => {
  Object.defineProperty(obj, val, {
    configurable: true,
    enumerable: true,
    set: function (nval) {
      val = nval;
      method(nval)
    },
    get: function () {
      return val
    }
  })
}
const delay = function (func, wait) {
  //看看有没有第三个参数
  var args = Array.prototype.slice.call(arguments, 2);
  return setTimeout(function () {
    //这边调用的时候传一下args，不管有没有
    return func.apply(null, args);
  }, wait);
};
const restArgs = function (func, startIndex) {
  //function.length表示function定义时，形式参数的个数。
  //注意此处是func.length，即传入的方法参数的形参个数而不是当前函数的参数个数，需要结合具体传入的参数来看。
  //当startIndex参数未传递时，默认func函数的最后一个参数开始为多余参数，会被整合到数组中。
  startIndex = startIndex == null ? func.length - 1 : +startIndex;
  return function () {
    //length表示构造的多余参数数组的长度，是实际的多余参数或者0。
    var length = Math.max(arguments.length - startIndex, 0),
      rest = Array(length),
      index = 0;
    //新建了一个rest数组，把位于startIndex索引之后的所有参数放入该数组。
    for (; index < length; index++) {
      rest[index] = arguments[index + startIndex];
    }
    //将多余参数放入rest数组之后，直接用Function.prototype.call执行函数。
    switch (startIndex) {
      case 0:
        return func.call(this, rest);
      case 1:
        return func.call(this, arguments[0], rest);
      case 2:
        return func.call(this, arguments[0], arguments[1], rest);
    }
    //如果startIndex > 2，那么使用apply传递数组作为参数的方式执行func。
    //虽然调用方法发生了变化，但是还是会把rest数组放在传入的参数数组的最后。
    //这样做其实与之前的方法无异（switch部分可以删除），但是call的效率高于apply。

    //args数组用于盛放startIndex之前的非多余参数。
    var args = Array(startIndex + 1);
    for (index = 0; index < startIndex; index++) {
      args[index] = arguments[index];
    }
    args[startIndex] = rest;
    return func.apply(this, args);
  };
};


const debounce = function (func, wait, immediate) {
  var timeout, result;

  var later = function (context, args) {
    timeout = null;
    if (args) result = func.apply(context, args);
  };

  var debounced = restArgs(function (args) {
    if (timeout) clearTimeout(timeout);
    if (immediate) {
      var callNow = !timeout;
      timeout = setTimeout(later, wait);
      if (callNow) result = func.apply(this, args);
    } else {
      timeout = delay(later, wait, this, args);
    }

    return result;
  });

  debounced.cancel = function () {
    clearTimeout(timeout);
    timeout = null;
  };

  return debounced;
};
module.exports = {
  debounce,
  formatTime,
  watch,
  onShareArticleMessage
}