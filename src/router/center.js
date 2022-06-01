import { MainLayouts } from '@/layouts'

export default [
  {
    path: '/center',
    component: MainLayouts,
    meta: { auth: true, title: '', hasFooter: true },
    children: [
      {
        path: '/center',
        name: 'Center',
        alias: '/center/index',
        component: () => import('views/Center.vue'),
        meta: { auth: true, title: '我的', hasFooter: true }
      }
    ]
  },
  {
    path: '/agreements',
    name: 'Agreements',
    meta: { auth: true, title: '协议与政策' },
    component: () => import('@/views/agreements')
  }
]
