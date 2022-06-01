export default [
  // {
  //   path: '/visitor/login',
  //   name: 'VisitorLogin',
  //   component: () => import('views/visitor/login.vue'),
  //   meta: { auth: false, title: '外来人员登记' }
  // },
  {
    path: '/visitor/details',
    name: 'VisitorDetails',
    component: () => import('views/visitor/details.vue'),
    meta: { auth: false, title: '访客信息' }
  },
  {
    path: '/visitor/checkIn',
    name: 'VisitorCheckIn',
    component: () => import('views/visitor/checkIn.vue'),
    meta: { auth: true, title: '外来人员登记' }
  },
  // {
  //   path: '/visitor/checkInAgain',
  //   name: 'VisitorCheckInAgain',
  //   component: () => import('views/visitor/checkInAgain.vue'),
  //   meta: { auth: false, title: '再次到访信息' }
  // },
  {
    path: '/visitor/checkQr',
    name: 'VisitorCheckQr',
    component: () => import('views/visitor/checkQr.vue'),
    meta: { auth: true, title: '外来人员登记', permission: 'FPMS_MENU_CODE_H5_VISITOR_CHECK_QR' }
  }
]
