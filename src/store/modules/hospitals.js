import {
    getSimpleHospitalBranchByHospitalIdApi,
    uploadImgApi
  } from "../../service/hospitals";
  import Vue from 'vue'
  
  const state = {
    
  };
  const getters = {
    
  }
  const mutations = {
  
  };
  const actions = {
    /**
     * 获取左侧菜单中的院区列表
     * @param commit
     * @param payload
     * @returns {Promise<any>}
     */
    uploadImg({ commit }, payload) {
        return uploadImgApi(payload.file).then(d => {
          return d;
        })
    },
    /**
      * 上传图片
      * @param commit
      * @param payload
      * @returns {Promise<any>}
      */
    getSimpleHospitalBranchByHospitalId({ commit }, payload) {
      return new Promise((resolve, reject) => {
        getSimpleHospitalBranchByHospitalIdApi(payload.platformHospitalId).then(d => {
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
  
