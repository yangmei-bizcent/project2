import store from '@/store/index'
import {
  lazyload
} from '@/util'

const routes = [
  {
    path: '/exp1',
    name: '流程图例子',
    meta: {
      title: '流程图-互联网医院应用管理后台'
    },
    component: lazyload('appointmentConfig/exp1')
  },

  {
  path: '/doctorDepart',
  redirect: '/doctortList',
  name: 'doctorDepartLayout',
  meta: {
    title: '互联网医院应用管理后台'
  },
  component: lazyload('doctorDepartLayout'),
  children: [{
      path: '/doctortList',
      name: 'doctortList',
      meta: {
        title: '科室信息配置-互联网医院应用管理后台'
      },
      component: lazyload('departmentDoctor/doctortList')
    }, {
      path: '/departmentDetail',
      name: 'departmentDetail',
      meta: {
        title: '科室详情-互联网医院应用管理后台'
      },
      component: lazyload('departmentDoctor/departmentDetail')
    }, {
      path: '/addDoctor',
      name: 'addDoctor',
      meta: {
        title: '新增医生-互联网医院应用管理后台'
      },
      component: lazyload('departmentDoctor/addDoctor')
    },
    {
      path: '/reportSearchConfig',
      name: 'reportSearchConfig',
      meta: {
        title: '报告单查询配置-互联网医院应用管理后台'
      },
      component: lazyload('reportSearchConfig'),
    },
    {
      path: '/visitRecord',
      name: 'visitRecord',
      meta: {
        title: '就诊记录配置-互联网医院应用管理后台'
      },
      component: lazyload('visitRecord/visitRecord'),
    },
  ]
}, {
  path: '/feedbackAndPosition',
  redirect: 'feedbackList',
  name: 'feedbackAndPositionLayout',
  meta: {
    title: '互联网医院应用管理后台'
  },
  component: lazyload('feedbackAndPositionLayout'),
  children: [{
    path: '/feedbackList',
    name: 'feedbackList',
    meta: {
      title: '互联网医院开放平台-应用管理后台-反馈列表'
    },
    component: lazyload('feedback/feedbackList')
  }, {
    path: '/feedbackConfig',
    name: 'feedbackConfig',
    meta: {
      title: '互联网医院开放平台-应用管理后台-相关配置'
    },
    component: lazyload('feedback/feedbackConfig')
  }, {
    path: '/feedbackDetail',
    name: 'feedbackDetail',
    meta: {
      title: '互联网医院开放平台-应用管理后台-反馈意见详情'
    },
    component: lazyload('feedback/feedbackDetail')
  }, {
    path: '/positionConfig',
    name: 'positionConfig',
    meta: {
      title: '互联网医院开放平台-应用管理后台-方位介绍信息配置 '
    },
    component: lazyload('positionIntro/positionConfig')
  }]
}, {
  path: '/configure',
  name: 'configureLayout',
  meta: {
    title: '互联网医院应用管理后台'
  },
  component: lazyload('configureLayout'),
  children: [{
    path: '/appointProcessConfig',
    name: 'appointProcessConfig',
    meta: {
      title: '互联网医院开放平台-应用管理后台-挂号流程配置'
    },
    component: lazyload('appointmentConfig/appointProcessConfig')
  }, {
    path: '/serviceSetting',
    name: 'serviceSetting',
    meta: {
      title: '互联网医院开放平台-应用管理后台-预约挂号业务配置'
    },
    component: lazyload('serviceSetting/serviceSetting')
  }, {
    path: '/numberSourceSetting',
    name: 'numberSourceSetting',
    meta: {
      title: '互联网医院开放平台-应用管理后台-号源数据配置'
    },
    component: lazyload('numberSourceSetting/numberSourceSetting')
  }, {
    path: '/deptManage',
    name: 'deptManage',
    meta: {
      title: '互联网医院开放平台-应用管理后台-科室管理'
    },
    component: lazyload('deptManage/deptManage')
  }, {
    path: '/deptDocManage',
    name: 'deptDocManage',
    meta: {
      title: '互联网医院开放平台-应用管理后台-科室管理'
    },
    component: lazyload('deptManage/deptDocManage')
  }, {
    path: '/doctorManage',
    name: 'doctorManage',
    meta: {
      title: '互联网医院开放平台-应用管理后台-号源数据配置-医生管理'
    },
    component: lazyload('doctorManage/doctorManage')
  }, {
    path: '/depOfSchedule',
    name: 'depOfSchedule',
    meta: {
      title: '互联网医院开放平台-应用管理后台-号源数据配置-排班设置-选择科室'
    },
    component: lazyload('scheduleConfig/depOfSchedule')
  }, {
    path: '/scheduleConfig',
    name: 'scheduleConfig',
    meta: {
      title: '互联网医院开放平台-应用管理后台-号源数据配置-排班设置'
    },
    component: lazyload('scheduleConfig/scheduleConfig')
  }, {
    path: '/suspendManage',
    name: 'suspendManage',
    meta: {
      title: '互联网医院开放平台-应用管理后台-号源数据配置-停诊管理'
    },
    component: lazyload('suspendManage/suspendManage')
  }, {
    path: '/registrationRecord',
    name: 'registrationRecord',
    meta: {
      title: '互联网医院开放平台-应用管理后台-挂号记录'
    },
    component: lazyload('registrationRecord/registrationRecord')
  }, {
    path: '/smsConfig',
    name: 'smsConfig',
    meta: {
      title: '互联网医院开放平台-应用配置后台-预约挂号信息配置'
    },
    component: lazyload('appointment/smsConfig')
  }]
}, {
  path: '/his',
    name: 'his',
    meta: {
      title: '医院his接口适配器'
    },
    component: lazyload('his')
}]

export {
  routes
}
