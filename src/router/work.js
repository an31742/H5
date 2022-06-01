export default [
  {
    path: '/work/report',
    name: 'WorkReport',
    component: () => import('views/work/report.vue'),
    meta: { auth: true, title: '自查报事', hasFooter: true, permission: 'FPMS_MENU_CODE_H5_WORK_REPORT' }
  },
  {
    path: '/work/rectification',
    name: 'WorkRectification',
    component: () => import('views/rectification/index.vue'),
    meta: { auth: true, title: '整改报障', hasFooter: true }
  },
  {
    path: '/work/deal',
    name: 'WorkDeal',
    component: () => import('views/work/deal.vue'),
    meta: { auth: true, title: '工单处理' }
  },
  {
    path: '/work/editLocus',
    name: 'WorkEditLocus',
    component: () => import('views/work/editLocus.vue'),
    meta: { auth: true, title: '工单处理' }
  },
  {
    path: '/work/broken',
    name: 'WorkBrokenReport',
    component: () => import('views/work/broken.vue'),
    meta: { auth: true, title: '故障工单' }
  },
  {
    path: '/goods/release',
    name: 'GoodsRelease',
    component: () => import('views/goods/list.vue'),
    meta: { auth: true, title: '物品放行' }
  },
  {
    path: '/goods/release/detail',
    name: 'GoodsReleaseDetail',
    component: () => import('views/goods/goodsRelease.vue'),
    meta: { auth: true, title: '物品放行详情' }
  }
]
