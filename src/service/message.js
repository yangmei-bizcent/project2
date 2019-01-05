import { axiosget, axiospost } from "./config";

export const messagepost = (_url, data) => axiospost(`message/${_url}`, data);
export const messageget = _url => axiosget(`message/${_url}`);