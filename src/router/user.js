export default [
  // {
  //   path: '/login',
  //   name: 'login',
  //   component: () => import('views/user/Login.vue'),
  //   meta: { title: '绑定手机号' }
  // },
  {
    path: '/user/feedback',
    name: 'FeedBack',
    component: () => import('views/user/FeedBack.vue'),
    meta: { auth: true, title: '功能反馈' }
  }
  // {
  //   path: '/user/pwd',
  //   name: 'ChangePwd',
  //   component: () => import('views/user/ChangePwd.vue'),
  //   meta: { title: '修改密码' }
  // },
  // {
  //   path: '/user/choosecompany',
  //   name: 'ChooseCompany',
  //   component: () => import('views/user/chooseCompany.vue'),
  //   meta: { auth: true, title: '选择公司进入' }
  // }
]
