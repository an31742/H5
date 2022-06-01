export default [
  {
    path: '/warehouse/transfer',
    name: 'transfer',
    component: () => import('views/warehouse/transfer.vue'),
    meta: { auth: true, title: '调拨入库确认通知' }
  },
  {
    path: '/warehouse/putstorage',
    name: 'putStorage',
    component: () => import('views/warehouse/putStorage.vue'),
    meta: { auth: true, title: '采买入库确认通知' }
  },
  {
    path: '/warehouse/fixedassets',
    name: 'fixedAssets',
    component: () => import('views/warehouse/FixedAssets.vue'),
    meta: { auth: true, title: '固资流转' }
  }
]
