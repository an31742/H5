export default [
  {
    path: '/materials/index',
    name: 'Materials',
    component: () => import('views/materials/index.vue'),
    meta: { auth: true, title: '物资盘点' }
  },
  {
    path: '/materials/end',
    name: 'MaterialsEnd',
    component: () => import('views/materials/end.vue'),
    meta: { auth: true, title: '已结束' }
  },
  {
    path: '/materials/result',
    name: 'MaterialsResult',
    component: () => import('views/materials/result.vue'),
    meta: { auth: true, title: '盘点结果' }
  },
  {
    path: '/materials/toBeCounted',
    name: 'MaterialsToBeCounted',
    component: () => import('views/materials/toBeCounted.vue'),
    meta: { auth: true, title: '待盘点' }
  },
  {
    path: '/materials/countedDetail',
    name: 'MaterialsCountedDetail',
    component: () => import('views/materials/countedDetail.vue'),
    meta: { auth: true, title: '任务详情' }
  },
  {
    path: '/materials/entry',
    name: 'Entry',
    component: () => import('views/materials/entry.vue'),
    meta: { auth: true, title: '盘点录入' }
  },
  {
    path: '/materials/underReview',
    name: 'MaterialsUnderReview',
    component: () => import('views/materials/underReview.vue'),
    meta: { auth: true, title: '复核中' }
  },
  {
    path: '/materials/reviewDetail',
    name: 'ReviewDetail',
    component: () => import('views/materials/reviewDetail.vue'),
    meta: { auth: true, title: '复核确认' }
  }
]
