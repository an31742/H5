import { DetailLayouts } from '@/layouts'

export default [
  {
    path: '/detail',
    name: '',
    component: DetailLayouts,
    meta: { auth: true, title: '详情', hasFooter: true },
    children: [
      {
        path: '/detail/message',
        name: 'DetailMessage',
        component: () => import('views/detail/message.vue'),
        meta: { auth: true, title: '消息详情' }
      },
      {
        path: '/detail/varifycode',
        name: 'DetailVarifycode',
        component: () => import('views/detail/varifycode.vue'),
        meta: { auth: true, title: '访客二维码详情' }
      },
      {
        path: '/detail/qrcodelist',
        name: 'DetailQrcodeList',
        component: () => import('views/qrcode/list.vue'),
        meta: { auth: true, title: '收款二维码列表' }
      },
      {
        path: '/detail/qrcodeDetail',
        name: 'DetailQrcodeBillDetail',
        component: () => import('views/qrcode/detail.vue'),
        meta: { auth: true, title: '收款详情' }
      },
      {
        path: '/detail/device',
        name: 'DeviceInfo',
        component: () => import('views/detail/deviceInfo.vue'),
        meta: { auth: true, title: '设备信息' }
      },
      {
        path: '/detail/download',
        name: 'DetailDownload',
        component: () => import('views/detail/download.vue'),
        meth: { auth: false, title: '文件下载' }
      }
    ]
  }
]
