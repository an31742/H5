import { AliveLayouts } from '@/layouts'

export default [
  {
    path: '/management',
    name: '',
    component: AliveLayouts,
    meta: { auth: true, title: '管家管理', keepAlive: true, hasFooter: true },
    children: [
      {
        path: '/management/detail/customer',
        name: 'ManagementCustomerDetail',
        component: () => import('views/management/customerDetail.vue'),
        meta: { auth: true, title: '客户详情' }
      },
      {
        path: '/management/detail/room',
        name: 'ManagementRoomDetail',
        component: () => import('views/management/roomDetail.vue'),
        meta: { auth: true, title: '房屋详情' }
      },
      {
        path: '/management/detail/parking',
        name: 'ManagementParkingDetail',
        component: () => import('views/management/parkingDetail.vue'),
        meta: { auth: true, title: '车位详情' }
      },
      {
        path: '/management/detail/vehicle',
        name: 'ManagementVehicleDetail',
        component: () => import('views/management/vehicleDetail.vue'),
        meta: { auth: true, title: '车辆详情' }
      }
    ]
  }
]
