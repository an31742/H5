import { CheckLayouts } from '@/layouts'

export default [
  {
    path: '/check',
    component: CheckLayouts,
    meta: { auth: true, title: '', hasFooter: false },
    children: [
      {
        path: '/check',
        name: 'CheckOn',
        component: () => import('views/check/on.vue'),
        meta: { auth: true, title: '当日打卡', hasFooter: false }
      },
      {
        path: '/check/statistic',
        name: 'CheckStatistic',
        component: () => import('views/check/statistic.vue'),
        meta: { auth: true, title: '考勤统计', hasFooter: false }
      }
    ]
  },
  {
    path: '/check/detail',
    name: 'CheckDetail',
    component: () => import('views/check/detail.vue'),
    meta: { auth: true, title: '汇总详情', hasFooter: false }
  }
]
