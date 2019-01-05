import { aixospatch, aixosput, axiosget, axiospost } from "./config";

const applicationpost = (_url, data) => axiospost(`config${_url}`, data);
const applicationput = (_url, data) => aixosput(`config${_url}`, data);
const applicationpatch = (_url, data) => aixospatch(`config${_url}`, data);
const applicationget = _url => axiosget(`config${_url}`);

/**
 *  查询flowId
 */
export const getUcUiFlowByPhIdAndUseTypeApi = (defaultPlatformHospitalId, useType) => applicationget(`/getUcUiFlowByPhIdAndUseType?defaultPlatformHospitalId=${defaultPlatformHospitalId}&useType=${useType}`);

/**
 *  获取配置
 */
export const getViewUiconfigListApi = (ucUiFlowId, stepId) => applicationget(`/getViewUiconfigList?ucUiFlowId=${ucUiFlowId}&stepId=${stepId}`);

/**
 *  保存配置
 */
export const updateUiconfigDetailsApi = (stepId, flowId, platformHospitalId, scyUserId, tUiConfigDetails) => applicationput(`/updateUiconfigDetails?stepId=${stepId}&flowId=${flowId}&platformHospitalId=${platformHospitalId}&scyUserId=${scyUserId}`, tUiConfigDetails);

/**
 * 多页面新增和修改配置信息
 */
export const updateMultiPageUiConfigDetailApi = (flowId, platformHospitalId, scyUserId, multiPageUiConfigDetails) => applicationput(`/updateMultiPageUiConfigDetail?flowId=${flowId}&platformHospitalId=${platformHospitalId}&scyUserId=${scyUserId}`, multiPageUiConfigDetails);

/**
 * 获取流程列表
 */
export const getRegFlowApi = (flowType) => applicationget(`/getRegFlow?flowType=${flowType}`);

/**
 * 切换挂号流程
 */
export const switchRegFlowApi = (platformHospitalId, scyUserId, flowType) => applicationget(`/switchRegFlow?platformHospitalId=${platformHospitalId}&scyUserId=${scyUserId}&flowType=${flowType}`);

