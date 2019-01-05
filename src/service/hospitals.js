import { aixospatch, aixosput, axiosget, axiospost } from "./config";

const applicationpost = (_url, data) => axiospost(`application${_url}`, data);
const applicationput = (_url, data) => aixosput(`application${_url}`, data);
const applicationpatch = (_url, data) => aixospatch(`application${_url}`, data);
const applicationget = _url => axiosget(`application${_url}`);

/**
 *  获取左侧菜单中的院区列表
 */
export const getSimpleHospitalBranchByHospitalIdApi = (platformHospitalId) => applicationget(`/branch/getSimpleHospitalBranchByHospitalId?platformHospitalId=${platformHospitalId}`);
/**
* 上传图片
*/
export const uploadImgApi = (data) => applicationpost(`/plat/auth/images/upload`, data);