export default [
  {
    path: '/decoration/index',
    name: 'Decoration',
    component: () => import('views/decoration/index.vue'),
    meta: { auth: true, title: '装修管理' }
  },
  {
    path: '/decoration/question',
    name: 'DecorationQuestion',
    component: () => import('views/decoration/question.vue'),
    meta: { auth: true, title: '装修管理' }
  },
  {
    path: '/decoration/material',
    name: 'DecorationMaterial',
    component: () => import('views/decoration/material.vue'),
    meta: { auth: true, title: '资料补充' }
  },
  {
    path: '/decoration/questionContent',
    name: 'DecorationQuestionContent',
    component: () => import('views/decoration/questionContent.vue'),
    meta: { auth: true, title: '问题内容' }
  },
  {
    path: '/decoration/historyDetail',
    name: 'DecorationHistoryDetail',
    component: () => import('views/decoration/historyDetail.vue'),
    meta: { auth: true, title: '问题详情' }
  },
  {
    path: '/decoration/replenish',
    name: 'DecorationReplenish',
    component: () => import('views/decoration/replenish.vue'),
    meta: { auth: true, title: '上传资料' }
  },
  {
    path: '/decoration/replenish',
    name: 'DecorationReplenish',
    component: () => import('views/decoration/replenish.vue'),
    meta: { auth: true, title: '上传资料' }
  }
]
