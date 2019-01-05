import { axiosget, axiospost } from "./config";

export const applicationpost = (_url, data) => axiospost(`application/${_url}`, data);
export const applicationget = _url => axiosget(`application/${_url}`);