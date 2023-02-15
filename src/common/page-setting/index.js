import Vue from 'vue'

import '@/assets/style/base.less'
import '@/assets/style/normalize.less'

// vue 过滤器
// import initRem from '@/common/rem.js'
// 竖屏时候保证宽度 1rem = 100px:
// 405 = 720*9/16
// 421.875 = 750*9/16
// 横屏时候保证高度 1rem = 100px: 720 || 750
// initRem(405)

Vue.config.productionTip = false
Vue.config.devtools = process.env.NODE_ENV !== 'production'

if (
  process.env.NODE_ENV !== 'production' ||
  process.env.VUE_APP_C_ENV_URL === 'test' ||
  process.env.VUE_APP_C_ENV_URL === 'pre'
) {
  const vconsole = require('vconsole')
  new vconsole()
}
