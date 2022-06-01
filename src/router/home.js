import { MainLayouts } from '@/layouts'

export default [
  {
    path: '/',
    component: MainLayouts,
    meta: { auth: true, title: '', hasFooter: true },
    children: [
      {
        path: '/',
        name: 'WorkBench',
        component: () => import('views/WorkBench.vue'),
        meta: { auth: true, title: '工作台', hasFooter: true }
      },
      {
        path: '/group/select',
        name: 'GroupSelect',
        component: () => import('views/group/groupSelect.vue'),
        meta: { auth: true, title: '选择小区', hasFooter: false }
      }
    ]
  }
]
