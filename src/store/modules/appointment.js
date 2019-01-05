import {
  getSmsConfigsApi,
  editSmsConfigApi
} from "../../service/appointment";
import Vue from 'vue'

const state = {};
const getters = {}
const mutations = {};
const actions = {
  /**
   * 根据应用类型和医院获取短信配置
   * @param platformHospitalId  医院标识
   * @param pushType 应用类型
   */
  getSmsConfigsApi({commit}, payload) {
    return getSmsConfigsApi(payload.platformHospitalId, payload.applicationName).then(d => {
      resolve(d);
    })
  },
  /**
   * 更新短信配置信息
   * @param data
   */
  editSmsConfigApi({commit}, payload) {
    return new Promise((resolve, reject) => {
      editSmsConfigApi(payload.platformHospitalId).then(d => {
        resolve(d);
      })
    })
  },
};
export default {
  state,
  getters,
  actions,
  mutations
}

