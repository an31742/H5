import { NoticeLayouts } from '@/layouts'

export default [
  {
    path: '/notice',
    name: 'Message',
    component: NoticeLayouts,
    redirect: '/message/work',
    meta: { auth: true, title: '', hasFooter: true },
    children: [
      {
        path: '/message/work',
        name: 'MessageWork',
        component: () => import('views/message/list.vue'),
        meta: { auth: true, title: '工单消息', hasFooter: true }
      },
      {
        path: '/message/approval',
        name: 'MessageApproval',
        component: () => import('views/message/list.vue'),
        meta: { auth: true, title: '我的审批', hasFooter: true }
      },
      {
        path: '/message/notice',
        name: 'MessageNotice',
        component: () => import('views/message/list.vue'),
        meta: { auth: true, title: '通知公告', hasFooter: true }
      }
    ]
  },
  {
    path: '/message/detail',
    name: 'MessageDetail',
    component: () => import('views/message/detail.vue'),
    meta: { auth: true, title: '我的消息' }
  }
]
