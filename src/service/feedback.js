import { axiosget, axiospost } from "./config";

export const feedbackpost = (_url, data) => axiospost(`feedback/${_url}`, data);
export const feedbackget = _url => axiosget(`feedback/${_url}`);