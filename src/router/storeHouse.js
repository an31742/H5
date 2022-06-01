export default [

  {
    path: '/storehouse/receive/apply',
    name: 'ReceiveApply',
    component: () => import('views/storeHouse/receive/apply.vue'),
    meta: { auth: true, title: '领用申请' }
  }, {
    path: '/storehouse/receive/add',
    name: 'ReceiveAdd',
    component: () => import('views/storeHouse/receive/add.vue'),
    meta: { auth: true, title: '发起申请' }
  }, {
    path: '/storehouse/receive/my/apply',
    name: 'MyApply1',
    component: () => import('views/storeHouse/receive/myApply.vue'),
    meta: { auth: true, title: '我的申请' }
  }, {
    path: '/storehouse/receive/apply/detail',
    name: 'MyReceiveApplyDetail',
    component: () => import('views/storeHouse/receive/applyDetail.vue'),
    meta: { auth: true, title: '申请详情' }
  }, {
    path: '/storehouse/receive/my/receive',
    name: 'MyReceive',
    component: () => import('views/storeHouse/receive/myReceive.vue'),
    meta: { auth: true, title: '我的领用' }
  }, {
    path: '/storehouse/receive/my/out',
    name: 'MyOut',
    component: () => import('views/storeHouse/receive/myOut.vue'),
    meta: { auth: true, title: '待我出库' }
  }, {
    path: '/storehouse/receive/my/out/detail',
    name: 'MyOutDetail',
    component: () => import('views/storeHouse/receive/outDetail.vue'),
    meta: { auth: true, title: '确认出库' }
  }, {
    path: '/storehouse/receive/search',
    name: 'MyReceiveSearch',
    component: () => import('views/storeHouse/receive/searchReceive.vue'),
    meta: { auth: true, title: '领用查询' }
  }
]
