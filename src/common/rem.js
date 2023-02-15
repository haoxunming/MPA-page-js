// designBase：竖屏时传入设计稿的宽度，横屏时传入设计稿的高度。页面固定宽高比16:9
const initRem =
  (doc, win) =>
  (designBase, fontSizeBase = 100) => {
    var docEl = doc.documentElement,
      dpr = window.devicePixelRatio || 1,
      resizeEvt =
        'orientationchange' in window ? 'orientationchange' : 'resize',
      recalc = function () {
        var clientHeight = docEl.clientHeight
        var clientWidth = docEl.clientWidth
        if (!clientHeight) return
        var wh = clientWidth / clientHeight
        // 基准像素
        if (!designBase) throw new Error('missing design base in rem.js')
        if (typeof designBase !== 'number')
          throw new Error('invalid design base')
        if (wh > 16 / 9) {
          // console.log(`[clientHeight]${clientHeight}`)
          docEl.style.fontSize =
            fontSizeBase * (clientHeight / designBase) + 'px'
          // docEl.style.fontSize = 100 * (clientHeight / 720) + 'px';
        } else {
          // console.log(`[clientWidth]${clientWidth}`)
          docEl.style.fontSize =
            fontSizeBase * ((clientWidth * 9) / (designBase * 16)) + 'px'
          // docEl.style.fontSize = 100 * ((clientWidth * 9) / (720 * 16)) + 'px';
        }

        resetFontSize()
      }

    dpr = dpr >= 3 ? 3 : dpr >= 2 ? 2 : 1
    docEl.setAttribute('data-dpr', dpr)

    // 页面都初始化完成了，才去初始化fontsize，如果别的地方需要计算缩放，根本就拿不到设置的font-size啊
    recalc()
    if (!doc.addEventListener) return
    win.addEventListener(resizeEvt, recalc, false)
    // doc.addEventListener('DOMContentLoaded', recalc, false)
  }
/**
 * 解决部分安卓机型在系统设置字体太大后rem的计算问题
 * 如OPPO A59M，部分华为手机
 * liquan01
 * 先动态创建一个不可见div元素，计算其实际像素大小，同原本作比较，
 * 然后计算出需要设置的基准fontSize值
 */
function resetFontSize() {
  var d = document.createElement('div')
  d.style.cssText =
    'width:1rem;height:0;overflow: hidden;position:absolute;z-index:-1;visibility: hidden;'
  document.body.appendChild(d)
  var dw = +getComputedStyle(d).width.slice(0, -2) // 1rem的实际展示px值
  document.body.removeChild(d)
  var html = document.querySelector('html')
  var fz = 0
  if (html.style.fontSize) {
    fz = +html.style.fontSize.slice(0, -2) || 0 //正常计算出来的rem基准值 , 可自行修改为rem计算好的值
  }
  var realRem = fz
  if (dw != fz) {
    //不相等 则被缩放了
    realRem = Math.pow(fz, 2) / dw
  }
  html.style.fontSize = realRem + 'px'
}

export default initRem(document, window)
