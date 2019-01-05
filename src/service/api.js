export const apiurl = {
  //application
  getHospitalList: 'branch/client/getSimpleHospitalBranchByHospitalId',//获取院区列表
  getPositionInfo: 'position/admin/getBranchPositionByBranchId',//获取包含方位介绍信息的院区信息
  postPositionInfo: 'position/admin/modifyBranchPosition',//保存方位介绍信息

  //auth
  getSmsConfig: 'auth/sms/config/list',//获取短信配置信息
  postSmsConfig: 'auth/sms/config/insertIfAbsent',//提交短信配置信息

  //feedback
  getFeedbackConfigInfo: 'config/add',//获取意见反馈配置信息
  postFeedbackConfigInfo: 'config/edit',//提交意见反馈配置信息
  getFeedbackDetail: 'manage/problemDetail',//获取意见反馈详细信息
  getFeedbackList: 'manage/searchProblem',//获取意见反馈列表
  exportFeedbackList: 'feedback/manage/exportProblem',//导出意见反馈列表
  filterFeedbackList: 'manage/problems',//筛选意见反馈列表
  //权限控制接口
  getuserFeatures:'user/roles/user/features',//获取模块权限数据
}