import {
  getDepartApi,
  getSecondGradeDepartApi,
  getDepartInfoApi,
  editDepartInfoApi,
  addDepartApi,
  deleteDepartApi,
  getDoctorsApi,
  getDoctorInfoApi,
  editDoctorInfoApi,
  addDoctorApi,
  deleteDoctorApi,
  batchDeleteDoctorApi,
  batchDownloadDoctorApi,
  batchUploadDoctorApi,
  getAppConfigApi,
  editAppConfigApi,
} from "../../service/depart";
import Vue from 'vue'
  
  const state = {
    
  };
  const getters = {
    
  }
  const mutations = {
  
    
  };
  const actions = {
    /**
     * 获取一级科室列表
     * @param commit
     * @param payload
     * @returns {Promise<any>}
     */
    getDepart({ commit }, payload) {
      return new Promise((resolve, reject) => {
        getDepartApi(payload.branchId).then(d => {
          resolve(d);
        })
      })
    },
    /**
     * 获取二级科室列表
     * @param commit
     * @param payload
     * @returns {Promise<any>}
     */
    getSecondGradeDepart({ commit }, payload) {
      return new Promise((resolve, reject) => {
        getSecondGradeDepartApi(payload.falcutyId).then(d => {
          resolve(d);
        })
      })
    },
    /**
     * 获取科室详细信息
     * @param commit
     * @param payload
     * @returns {Promise<any>}
     */
    getDepartInfo({ commit }, payload) {
      return new Promise((resolve, reject) => {
        getDepartInfoApi(payload.falcutyId).then(d => {
          resolve(d);
        })
      })
    },
    /**
     * 修改科室信息
     * @param commit
     * @param payload
     * @returns {Promise<any>}
     */
    editDepartInfo({ commit }, payload) {
      return new Promise((resolve, reject) => {
        editDepartInfoApi(payload.falcutyId, payload.tFaculty).then(d => {
          resolve(d);
        })
      })
    },
    /**
     * 新增科室
     * @param commit
     * @param payload
     * @returns {Promise<any>}
     */
    addDepart({ commit }, payload) {
       return addDepartApi(payload.branchId, payload.falcutyId, payload.tFaculty).then(d => {
          return d;
        })
    },
    /**
     * 删除科室
     * @param commit
     * @param payload
     * @returns {Promise<any>}
     */
    deleteDepart({ commit }, payload) {
      return new Promise((resolve, reject) => {
        deleteDepartApi(payload.facultyId).then(d => {
          resolve(d);
        })
      })
    },
    /**
      * 获取医生列表
      * @param commit
      * @param payload
      * @returns {Promise<any>}
      */
    getDoctors({ commit }, payload) {
      return new Promise((resolve, reject) => {
        getDoctorsApi(payload.branchId, payload.facultyId, payload.searchStr, payload.pageNo, payload.pageSize).then(d => {
          resolve(d);
        })
      })
    },
  /**
    * 获取医生详情
    * @param commit
    * @param payload
    * @returns {Promise<any>}
    */
  getDoctorInfo({ commit }, payload) {
    return new Promise((resolve, reject) => {
      getDoctorInfoApi(payload.doctorId).then(d => {
        resolve(d);
      })
    })
  },
 /**
   * 修改医生信息
   * @param commit
   * @param payload
   * @returns {Promise<any>}
   */
  editDoctorInfo({ commit }, payload) {
    return new Promise((resolve, reject) => {
      editDoctorInfoApi(payload.doctorId, payload.doctorInfo).then(d => {
        resolve(d);
      })
    })
  },
  /**
    * 创建医生
    * @param commit
    * @param payload
    * @returns {Promise<any>}
    */
   addDoctor({ commit }, payload) {
     return new Promise((resolve, reject) => {
      addDoctorApi(payload.branchId, payload.facultyId, payload.doctorInfo).then(d => {
         resolve(d);
       })
     })
   },
   /**
     * 删除医生
     * @param commit
     * @param payload
     * @returns {Promise<any>}
     */
    deleteDoctor({ commit }, payload) {
      return new Promise((resolve, reject) => {
        deleteDoctorApi(payload.doctorId).then(d => {
          resolve(d);
        })
      })
    },
    /**
      * 批量删除医生
      * @param commit
      * @param payload
      * @returns {Promise<any>}
      */
     batchDeleteDoctor({ commit }, payload) {
       return new Promise((resolve, reject) => {
        batchDeleteDoctorApi(payload.doctorIds).then(d => {
           resolve(d);
         })
       })
     },
     /**
      * 批量导出医生batchUploadDoctor
      * @param commit
      * @param payload
      * @returns {Promise<any>}
      */
     batchDownloadDoctor({ commit }, payload) {
      return new Promise((resolve, reject) => {
        batchDownloadDoctorApi(payload.branchId).then(d => {
          resolve(d);
        })
      })
    },
    /**
     * 批量导出医生
     * @param commit
     * @param payload
     * @returns {Promise<any>}
     */
    batchUploadDoctor({ commit }, payload) {
     return new Promise((resolve, reject) => {
      batchUploadDoctorApi(payload.branchId, payload.importType, payload.file).then(d => {
         resolve(d);
       })
     })
   },
   /**
    * 获取科室展示配置
    * @param commit
    * @param payload
    * @returns {Promise<any>}
    */
   getAppConfig({ commit }, payload) {
    return new Promise((resolve, reject) => {
      getAppConfigApi(payload.branchId).then(d => {
        resolve(d);
      })
    })
  },
  /**
    * 修改科室展示配置
    * @param commit
    * @param payload
    * @returns {Promise<any>}
    */
   editAppConfig({ commit }, payload) {
    return new Promise((resolve, reject) => {
      editAppConfigApi(payload.facultyConfigId, payload.tHospitalConfig).then(d => {
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
  
