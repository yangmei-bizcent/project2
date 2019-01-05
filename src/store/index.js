import Vue from 'vue'
import Vuex from 'vuex'
import base from './modules/base'
import hospitals from './modules/hospitals'
import depart from './modules/depart'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    base,
    hospitals,
    depart
  },
  strict: process.env.NODE_ENV !== 'production' //  进行自动判断严格模式还是非严格模式（开发环境下是严格模式）做这个判断是为了避免不必要的性能损耗
})
