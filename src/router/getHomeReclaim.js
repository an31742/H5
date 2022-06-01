// 上门回收系列
import { AliveLayouts } from '@/layouts'
export default [
  {
    path: '/home-reclaim',
    component: AliveLayouts,
    props: { key: 'homeReclaim' },
    children: [
      {
        path: '/reclaim-order',
        name: 'ReclaimOrder',
        component: () => import('views/getHomeReclaim/ReclaimOrder/index'),
        meta: { auth: true, title: '回收订单' }
      },
      {
        path: '/evaluation-order',
        name: 'EvaluationOrder',
        component: () => import('views/getHomeReclaim/EvaluationOrder/index'),
        meta: { auth: true, title: '回收估价' }
      },
      {
        path: '/reclaim-search-list',
        name: 'ReclaimSearchList',
        component: () => import('views/getHomeReclaim/SearchPage.vue'),
        meta: { auth: true, title: '订单搜索' }
      },
      {
        path: '/valet-evaluation',
        name: 'ValetEvaluation',
        component: () => import('views/getHomeReclaim/ValetEvaluation/index.vue'),
        meta: { auth: true, title: '代客提单' }
      },
      {
        path: '/add-evaluation',
        name: 'GetHomeReclaim',
        component: () => import('views/getHomeReclaim/AddEvaluationOrder/index'),
        meta: { auth: true, title: '估价', hideKeepAliveLayout: true }
      },
      {
        path: '/add-success',
        name: 'AddSuccess',
        component: () => import('views/getHomeReclaim/AddSuccess/index'),
        meta: { auth: true, title: '提交订单', hideKeepAliveLayout: true }
      },
      {
        path: '/reclaim-order-detail',
        name: 'ReclaimOrderDetail',
        component: () => import('views/getHomeReclaim/OrderDetail/index'),
        meta: { auth: true, title: '订单详情', hideKeepAliveLayout: true }
      },
      {
        path: '/set-real-amount',
        name: 'SetRealAmount',
        component: () => import('views/getHomeReclaim/SetRealAmount.vue'),
        meta: { auth: true, title: '填写报价', hideKeepAliveLayout: true }
      }
    ]
  }
]
