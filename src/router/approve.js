import { ApproveLayouts } from '@/layouts'

export default [
  {
    path: '/approve',
    component: ApproveLayouts,
    meta: { auth: true, title: '', permission: 'FPMS_MENU_CODE_H5_GROUP_APPROVE' },
    children: [
      {
        path: '/approve',
        name: 'Approve',
        component: () => import('views/approve/index.vue'),
        meta: { auth: true, title: '审批' }
      },
      {
        path: '/approve/template',
        name: 'ApproveTemplate',
        component: () => import('views/approve/template.vue'),
        meta: { auth: true, title: '发起申请' }
      },
      {
        path: '/approve/apply',
        name: 'MyApply',
        component: () => import('views/approve/apply.vue'),
        meta: { auth: true, title: '我申请的' }
      },
      {
        path: '/approve/pending',
        name: 'PendingApprove',
        component: () => import('views/approve/pending.vue'),
        meta: { auth: true, title: '待我审批' }
      },
      {
        path: '/approve/approved',
        name: 'MyApproved',
        component: () => import('views/approve/approved.vue'),
        meta: { auth: true, title: '我审批的' }
      },
      {
        path: '/approve/cc',
        name: 'CCMeApprove',
        component: () => import('views/approve/CCMe.vue'),
        meta: { auth: true, title: '抄送我的' }
      },
      {
        path: '/approve/detail',
        name: 'ApproveDetail',
        component: () => import('views/approve/detail.vue'),
        meta: { auth: true, title: '审批详情' }
      },
      {
        path: '/approve/edit',
        name: 'ApproveEdit',
        component: () => import('views/approve/edit.vue'),
        meta: { auth: true, title: '报销申请' }
      }
    ]
  }
]
