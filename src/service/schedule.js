import { axiosget, axiospost, axiosdel } from "./config";

export const schedulepost = (_url, data) => axiospost(`schedule/${_url}`, data);
export const scheduleget = _url => axiosget(`schedule/${_url}`);
export const scheduledel = _url => axiosdel(`schedule/${_url}`);