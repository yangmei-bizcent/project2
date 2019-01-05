// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuex from 'vuex'
import store from './store/index'

import ElementUI  from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import './util/go.js'
import 'babel-polyfill'

Vue.use(Vuex)
Vue.use(ElementUI)
Vue.use(Vuex)
Vue.prototype.setTab=((name)=>{//控制菜单样式
  let tabList=['service','appointProcessConfig','numberSource','registerHistory','message'];//需要显示的tab名
  let tabPath=['serviceSetting','appointProcessConfig','numberSourceSetting','registrationRecord','smsConfig'];//对应的路由名
  let tabIndex=""
  tabPath.forEach((value,index)=>{
    if(name==value){
      tabIndex= tabList[index];
    }
  })
  return tabIndex;
})

Vue.config.productionTip = false
// Vue.prototype.setTab=((name)=>{//控制菜单样式
//   let tabList=['index','service','developer','product','help','example','contact','about'];//需要显示的tab名
//   let tabPath=['index','serCenIndex'];
//   let tabIndex=""
//   tabPath.forEach((value,index)=>{
//     if(name==value){
//       tabIndex= tabList[index];
//     }
//   })
//   return tabIndex;
// })

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
