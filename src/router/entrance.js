import { EntranceLayouts } from '@/layouts'

export default [
  {
    path: '/entrance',
    name: 'entrance',
    component: EntranceLayouts,
    meta: { auth: true, keepAlive: true, title: '', hasFooter: true, permission: 'FPMS_MENU_CODE_H5_ENTRANCE' },
    redirect: '/entrance/face',
    children: [
      {
        path: '/entrance/face',
        name: 'entranceFace',
        component: () => import('views/entrance/face'),
        meta: { auth: true, title: '我的门禁', hasFooter: false }
      },
      {
        path: '/entrance/selectuser',
        name: 'entranceFaceSelectUser',
        component: () => import('views/entrance/selectUser'),
        meta: { auth: true, title: '我的门禁', hasFooter: false, keepAlive: true }
      },
      {
        path: '/entrance/password',
        name: 'entrancePassword',
        component: () => import('views/entrance/password'),
        meta: { auth: true, title: '我的门禁', hasFooter: false }
      },
      {
        path: '/entrance/password4edit',
        name: 'entrancePassword4Edit',
        component: () => import('views/entrance/password'),
        meta: { auth: true, title: '我的门禁', hasFooter: false }
      }
    ]
  },
  {
    path: '/entrance/face/edit',
    name: 'entranceFaceEdit',
    component: () => import('views/entrance/faceEdit'),
    meta: { auth: true, title: '人脸录入', hasFooter: false, keepAlive: true }
  },
  {
    path: '/entrance/password/staff',
    name: 'entrancePasswordStaff',
    component: () => import('views/entrance/passwordSelectUser'),
    meta: { auth: true, title: '我的门禁', hasFooter: false, keepAlive: false }
  },
  {
    path: '/entrance/password/staff/select',
    name: 'entrancePasswordStaffSelect',
    component: () => import('views/entrance/passwordSelectUser'),
    meta: { auth: true, title: '我的门禁', hasFooter: false, keepAlive: false }
  }
]
