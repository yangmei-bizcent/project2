import { aixospatch, aixosput, axiosget, axiospost, axiosdel } from "./config";

const departDoctorpost = (_url, data) => axiospost(`hospital${_url}`, data);
const departDoctorput = (_url, data) => aixosput(`hospital${_url}`, data);
const departDoctorpatch = (_url, data) => aixospatch(`hospital${_url}`, data);
const departDoctorget = _url => axiosget(`hospital${_url}`);
const departDoctordel = (_url, data) => axiosdel(`hospital${_url}`, data);

/**
 *  获取一级和二级科室列表
 */
export const getDepartApi = (branchId) => departDoctorget(`/auth/hospitals/${branchId}/factulties`);
/**
 *  获取二级科室列表
 */
export const getSecondGradeDepartApi = (falcutyId) => departDoctorget(`/auth/hospitals/${falcutyId}/facultychilds`);
/**
 *  获取科室详细信息
 */
export const getDepartInfoApi = (facultyId) => departDoctorget(`/auth/hospitals/factulties/${facultyId}`);
/**
 *  修改科室信息
 */
export const editDepartInfoApi = (facultyId, data) => departDoctorpost(`/auth/hospitals/faculties/${facultyId}`, data);
/**
 *  新增科室
 */
export const addDepartApi = (branchId, facultyId, data) => departDoctorpost(`/auth/hospitals/${branchId}/${facultyId}/factulty`, data);
/**
 *  删除科室
 */
export const deleteDepartApi = (facultyId) => departDoctordel(`/auth/hospitals/faculties/${facultyId}`);



/**
 *  获取医生列表
 */
export const getDoctorsApi = (branchId, facultyId, searchStr, pageNo, pageSize) => departDoctorget(`/auth/hospitals/${branchId}/faculties/doctors?facultyId=${facultyId}&searchStr=${searchStr}&pageNo=${pageNo}&pageSize=${pageSize}`);
/**
 *  获取医生详情
 */
export const getDoctorInfoApi = (doctorId) => departDoctorget(`/auth/hospitals/faculties/doctors/${doctorId}`);
/**
 *  修改医生信息
 */
export const editDoctorInfoApi = (doctorId, data) => departDoctorput(`/auth/hospitals/faculties/doctors/${doctorId}`, data);
/**
 *  创建医生
 */
export const addDoctorApi = (branchId, facultyId, data) => departDoctorpost(`/auth/hospitals/${branchId}/faculties/${facultyId}/doctor`, data);
/**
 * 删除医生
 */
export const deleteDoctorApi = (doctorId) => departDoctordel(`/auth/hospitals/faculties/doctors/${doctorId}`);
/**
 * 批量删除医生
 */
export const batchDeleteDoctorApi = (doctorIds) => departDoctordel(`/auth/hospitals/faculties/doctors?doctorIds=${doctorIds}`);
/**
* 批量导出医生
*/
export const batchDownloadDoctorApi = (branchId) => departDoctorget(`/auth/export/${branchId}`);
/**
* 批量导入医生
*/
export const batchUploadDoctorApi = (branchId, importType, data) => departDoctorpost(`/auth/imports/${branchId}/${importType}`, data);
/**
* 获取科室展示配置
*/
export const getAppConfigApi = (branchId) => departDoctorget(`/auth/faculty/${branchId}/config`);
/**
* 修改科室展示配置
*/
export const editAppConfigApi = (facultyConfigId, data) => departDoctorpost(`/auth/faculty/${facultyConfigId}/config/edit`, data);