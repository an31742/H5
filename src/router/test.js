export default [
  {
    path: '/test1',
    name: 'Test1',
    component: () => import('views/test/test1.vue'),
    meta: { auth: true, title: '测试页面1' }
  },
  {
    path: '/test',
    name: 'Test',
    component: () => import('views/test/test.vue'),
    meta: { auth: true, title: '测试页面' }
  },
  {
    path: '/test/approve',
    name: 'TestApprove',
    component: () => import('views/test/approve.vue'),
    meta: { auth: true, title: '审批流组件测试页面' }
  },
  {
    path: '/form/preview',
    name: 'FromPreview',
    component: () => import('views/formApprove/preview.vue'),
    meta: { title: '审批流表单组件' }
  }
]
