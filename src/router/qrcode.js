export default [
  {
    path: '/qrcode/list',
    name: 'QrcodeList',
    component: () => import('views/qrcode/list.vue'),
    meta: { auth: true, title: '收款二维码列表', permission: 'FPMS_MENU_CODE_H5_QRCODE_LIST' }
  },
  {
    path: '/qrcode/detail',
    name: 'QrcodeDetail',
    component: () => import('views/qrcode/detail.vue'),
    meta: { auth: true, title: '收款详情' }
  }
]
