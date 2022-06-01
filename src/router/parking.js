import { DetailLayouts } from '@/layouts'

export default [
  {
    path: '/shareparking',
    name: 'ShareParking',
    component: DetailLayouts,
    meta: { auth: true, title: '订单详情', hasFooter: true },
    children: [
      {
        path: '/shareparking/detail',
        name: 'ShareParkingDetail',
        component: () => import('views/shareParking/index.vue'),
        meta: { auth: true, title: '订单详情', hasFooter: true }
      }
    ]
  }
]
