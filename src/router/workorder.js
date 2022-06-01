import { AliveLayouts } from '@/layouts'

export default [
  {
    path: '/work',
    name: '',
    component: AliveLayouts,
    props: { key: 'workorder' },
    meta: { auth: true, title: '', hasFooter: true },
    children: [
      {
        path: '/work/mytodo',
        name: 'WorkMyTodo',
        component: () => import('views/work/myTodo.vue'),
        meta: { auth: true, title: '我的待办', hasFooter: true, keepAlive: true }
      },
      {
        path: '/search/work',
        name: 'SearchWork',
        component: () => import('views/work/work.vue'),
        meta: { auth: true, title: '工单查询', permission: 'FPMS_MENU_CODE_H5_SEARCH_WORK' }
      },
      {
        path: '/detail/work',
        name: 'WorkDetail',
        component: () => import('views/detail/workDetail.vue'),
        meta: { auth: true, title: '工单详情' }
      },
      {
        path: '/detail',
        name: 'DetailWork',
        component: () => import('views/detail/work.vue'),
        meta: { auth: true, title: '工单详情' }
      }
    ]
  }
]
