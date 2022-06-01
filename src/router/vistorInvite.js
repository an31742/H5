export default [
  {
    path: '/visitorHistory',
    name: 'VisitorHistory',
    component: () => import('views/visitorInvite/index.vue'),
    meta: { auth: true, title: '访客预约' }
  },
  {
    path: '/visitorInvite',
    name: 'VisitorInvite',
    component: () => import('views/visitorInvite/invite.vue'),
    meta: { auth: true, title: '访客记录' }
  },
  {
    path: '/inviteShare',
    name: 'InviteShare',
    component: () => import('views/visitorInvite/inviteShare.vue'),
    meta: { auth: true, title: '访客记录' }
  },
  {
    path: '/inviteVistor',
    name: 'inviteVistor',
    component: () => import('views/visitorInvite/inviteVistor.vue'),
    meta: { auth: true, title: '访客信息' }
  }
]
