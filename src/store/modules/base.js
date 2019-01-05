import {
  SET_TOKEN,
  SET_PHONE,
  SET_PLATFORMHOSPITALID,
  SET_CURRENTDATE,
  SET_HOSANDDEPARTS,
  SET_USERNAME,
  SET_PLATFORMHOSPITALNAME,
  SET_HOSPITALBRANCHID,
  SET_JURISDICTION,
  SET_MODULEPER
} from '../mutation-types'

const state = {
  token: '',
  phone: '',
  userName: '',
  platformHospitalId: '',
  platformHospitalName: '',
  currentDate: '',
  hosAndDeparts: [],
  hospitalBranchId: '',
  Jurisdiction:"",
  moduleper:""
};
const getters = {
  token: function (state) {
    return !sessionStorage.getItem('token') ? state.token : sessionStorage.getItem('token');
  },
  phone: function (state) {
    return !sessionStorage.getItem('phone') ? state.phone : sessionStorage.getItem('phone');
  },
  userName: function (state) {
    return !sessionStorage.getItem('userName') ? state.userName : sessionStorage.getItem('userName');
  },
  platformHospitalId: function (state) {
    return !sessionStorage.getItem('platformHospitalId') ? state.platformHospitalId : sessionStorage.getItem('platformHospitalId');
  },
  platformHospitalName: function (state) {
    return !sessionStorage.getItem('platformHospitalName') ? state.platformHospitalName : sessionStorage.getItem('platformHospitalName');
  },
  currentDate: function (state) {
    return !sessionStorage.getItem('currentDate') ? state.currentDate : sessionStorage.getItem('currentDate');
  },
  hosAndDeparts: function (state) {
    return !sessionStorage.getItem('hosAndDeparts') ? state.hosAndDeparts : JSON.parse(sessionStorage.getItem('hosAndDeparts'));
  },
  hospitalBranchId: function (state) {
    return !sessionStorage.getItem('hospitalBranchId') ? state.hospitalBranchId : sessionStorage.getItem('hospitalBranchId');
  },
  Jurisdiction: function(state){
    if(state.Jurisdiction==''||state.Jurisdiction==null||state.Jurisdiction==undefined){
      return  JSON.parse(sessionStorage.getItem('JurisdictionS'));
    }
    return state.Jurisdiction;
    
  },
  moduleper:function(state){
    if(state.moduleper=='' || state.moduleper==null || state.moduleper==undefined){
      return JSON.parse(sessionStorage.getItem('moduleperS'));
    }
    return state.moduleper;
  }
};

const mutations = {
  [SET_TOKEN](state, token) {
    sessionStorage.setItem('token', token);
    state.token = token;
  },
  [SET_PHONE](state, phone) {
    sessionStorage.setItem('phone', phone);
    state.phone = phone;
  },
  [SET_USERNAME](state, userName) {
    sessionStorage.setItem('userName', userName);
    state.userName = userName;
  },
  [SET_PLATFORMHOSPITALID](state, platformHospitalId) {
    sessionStorage.setItem('platformHospitalId', platformHospitalId);
    state.platformHospitalId = platformHospitalId;
  },
  [SET_PLATFORMHOSPITALNAME](state, platformHospitalName) {
    sessionStorage.setItem('platformHospitalName', platformHospitalName);
    state.platformHospitalName = platformHospitalName;
  },
  [SET_CURRENTDATE](state, currentDate) {
    sessionStorage.setItem('currentDate', currentDate);
    state.currentDate = currentDate;
  },
  [SET_HOSANDDEPARTS](state, hosAndDeparts) {
    sessionStorage.setItem('hosAndDeparts', JSON.stringify(hosAndDeparts));
    state.hosAndDeparts = hosAndDeparts;
  },
  [SET_HOSPITALBRANCHID](state, hospitalBranchId) {
    sessionStorage.setItem('hospitalBranchId', hospitalBranchId);
    state.hospitalBranchId = hospitalBranchId;
  },
  [SET_JURISDICTION](state, Jurisdiction) {
    state.Jurisdiction = Jurisdiction;
  },
  [SET_MODULEPER](state, moduleper) {
    state.moduleper = moduleper;
  }
};
const actions = {
  set_token({
    commit
  }, token) {
    commit(SET_TOKEN, token)
  },
  set_phone({
    commit
  }, phone) {
    commit(SET_PHONE, phone)
  },
  set_userName({
    commit
  }, userName) {
    commit(SET_USERNAME, userName)
  },
  set_platformHospitalName({
    commit
  }, platformHospitalName) {
    commit(SET_PLATFORMHOSPITALNAME, platformHospitalName)
  },
  set_platformHospitalId({
    commit
  }, platformHospitalId) {
    commit(SET_PLATFORMHOSPITALID, platformHospitalId)
  },
  set_currentDate({
    commit
  }, currentDate) {
    commit(SET_CURRENTDATE, currentDate)
  },
  set_hosAndDeparts({
    commit
  }, hosAndDeparts) {
    commit(SET_HOSANDDEPARTS, hosAndDeparts)
  },
  set_hospitalBranchId({
    commit
  }, hospitalBranchId) {
    commit(SET_HOSPITALBRANCHID, hospitalBranchId)
  },
  set_Jurisdiction({commit},Jurisdiction){
    sessionStorage.setItem('JurisdictionS', JSON.stringify(Jurisdiction));
    commit(SET_JURISDICTION, Jurisdiction);
  },
  set_moduleper({commit},moduleper){
    sessionStorage.setItem('moduleperS', JSON.stringify(moduleper));
    commit(SET_MODULEPER, moduleper);
  }
};

export default {
  state,
  getters,
  actions,
  mutations
}
