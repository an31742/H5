export default [
  {
    path: '/storemanage/transfer',
    name: 'transferV2',
    component: () => import('views/storemanage/transfer.vue'),
    meta: { auth: true, title: '调拨单' }
  },
  {
    path: '/storemanage/putstorage',
    name: 'putStorageV2',
    component: () => import('views/storemanage/putStorage.vue'),
    meta: { auth: true, title: '入库单' }
  },
  {
    path: '/storemanage/fixedassets',
    name: 'fixedAssetsV2',
    component: () => import('views/storemanage/FixedAssets.vue'),
    meta: { auth: true, title: '采购申请单' }
  }
]
