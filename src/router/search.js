import { AliveLayouts } from '@/layouts'

export default [
  {
    path: '/search',
    name: '',
    component: AliveLayouts,
    meta: { auth: true, title: '搜索', hasFooter: true, permission: 'FPMS_MENU_CODE_H5_SEARCH' },
    children: [
      {
        path: '/search/customer',
        name: 'SearchCustomer',
        component: () => import('views/search/customer.vue'),
        meta: { auth: true, title: '客户查询', permission: 'FPMS_MENU_CODE_H5_SEARCH_CUSTOMER' }
      },
      {
        path: '/search/room',
        name: 'SearchRoom',
        component: () => import('views/search/room.vue'),
        meta: { auth: true, title: '房屋查询', permission: 'FPMS_MENU_CODE_H5_SEARCH_ROOM' }
      },
      {
        path: '/search/parking',
        name: 'SearchParking',
        component: () => import('views/search/parking.vue'),
        meta: { auth: true, title: '车位查询', permission: 'FPMS_MENU_CODE_H5_SEARCH_PARKING' }
      },
      {
        path: '/search/vehicle',
        name: 'SearchVehicle',
        component: () => import('views/search/vehicle.vue'),
        meta: { auth: true, title: '车辆查询', permission: 'FPMS_MENU_CODE_H5_SEARCH_VEHICLE' }
      },
      {
        path: '/search/work/customer',
        name: 'SearchWorkCustomer',
        component: () => import('views/work/workCustomer.vue'),
        meta: { auth: true, title: '查找客户', permission: 'FPMS_MENU_CODE_H5_SEARCH_WORK_CUSTOMER' }
      }
    ]
  }
]
