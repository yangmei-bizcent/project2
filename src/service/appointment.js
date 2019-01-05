import {axiosget, axiospost} from "./config";

const appointmentget = (_url) => axiosget(`message${_url}`);
const appointmentpost = (_url, data) => axiospost(`message${_url}`, data);

/**
 * 根据应用类型和医院获取短信配置
 * @param platformHospitalId  医院标识
 * @param pushType 应用类型
 */
export const getSmsConfigsApi = (platformHospitalId, applicationName) => appointmentget(`/auth/sms/config/list?platformHospitalId=${platformHospitalId}/applicationName=${applicationName}`);

/**
 * 更新短信配置信息
 * @param data
 */
export const editSmsConfigApi = (data) => appointmentpost(`/auth/sms/config/insertIfAbsent`, data);
