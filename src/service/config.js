import axios from "axios"
import store from '../store/index'
import {
  Message
} from 'element-ui'

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  config.headers.Authorization = store.getters.token;
  config.headers['X-SERVER-ID'] = '1111';
  return config
}, function (error) {
  //console.log('请求失败')
});

// 添加响应拦截器
axios.interceptors.response.use(function (config) {
  if (config.hasOwnProperty('data') && config.data.hasOwnProperty('code')) {
    if (401 == config.data.code) {
      // localStorage.removeItem('token');
      // localStorage.removeItem('userName');
      localStorage.clear();
      sessionStorage.clear()
      // window.location.href = exportLocalUrl + "/";
      return;
    }
    Message.error(config.data.msg);
    return Promise.reject(config);
  }else{
    return config
  }
  
}, function (error) {
  //console.log('error',error)
  if(error.response){
    errorFn(error);
    return Promise.reject(error)
  }else{
    Message.error('请求服务器失败！') 
  }
});

export const errorFn = error => {
  switch (error.response.status) {
    case 400:
      Message.error('请求错误(400)', '提示');
      break;
    case 403:
      Message.error('拒绝访问(403)', '提示');
      break;
    case 404:
      Message.error('请求出错(404)', '提示');
      break;
    case 405:
      Message.error('拒绝访问(405)', '提示');
      break;
    case 408:
      Message.error('请求超时(408)', '提示');
      break;
    case 500:
      Message.error('系统网络有点小延迟，请稍等~', '提示');
      break;
    case 501:
      Message.error('服务未实现(501)', '提示');
      break;
    case 502:
      Message.error('网络错误(502)', '提示');
      break;
    case 503:
      Message.error('服务不可用(503)', '提示');
      break;
    case 504:
      Message.error('网络超时(504)', '提示');
      break;
    case 505:
      Message.error('HTTP版本不受支持(505)', '提示');
      break;
    default:
      Message.error('连接出错', '提示');
      break;
  }
};

export const axiosConfig = {
  baseURL: URL_CONFIG.backendBaseUrl,
  headers: {
    "Content-Type": "application/json;charset=utf-8",
    "Accept": "application/json",
    //临时
    "X-SERVER-ID": "11111111",
    // "X-BUSINESS-ID": "b01a297-4d15-4068-bc8e-9e159b374238"
  },
  timeout: 10000
};


/**
 * http post 请求
 * @param _url
 * @param obj
 * @returns {Promise<AxiosResponse<any> | never>}
 */
export const axiospost = (_url, obj) => {
  return axios.post(_url, obj, axiosConfig)
};

/**
 * http post 请求
 * @param _url
 * @param obj
 * @returns {Promise<AxiosResponse<any> | never>}
 */
export const axiospost_params = (_url, obj, params) => {
  return axios.post(_url, obj, Object.assign(params,axiosConfig))
};

/**
 * https 全部数据修改
 * @param _url
 * @param obj
 * @returns {Promise<AxiosResponse<any> | never>}
 */
export const aixosput = (_url, obj) => {
  return axios.put(_url, obj, axiosConfig)
};

/**
 *  https 局部数据修改
 * @param _url
 * @param obj
 * @returns {Promise<AxiosResponse<any> | never>}
 */
export const aixospatch = (_url, obj) => {
  return axios.patch(_url, obj, axiosConfig)
};

/**
 * https 获取数据资源
 * @param _url
 * @returns {Promise<AxiosResponse<any> | never>}
 */
export const axiosget = (_url) => {
  return axios.get(_url, axiosConfig)
};

/**
 * https 获取数据资源
 * @param _url
 * @returns {Promise<AxiosResponse<any> | never>}
 */
export const axiosget_params = (_url, params) => {
  return axios.get(_url, Object.assign({params:params},axiosConfig))
};

/**
 * https 数据删除
 * @param _url
 * @returns {Promise<AxiosResponse<any> | never>}
 */
export const axiosdel = (_url, obj) => {
  return axios.delete(_url, axiosConfig)
};