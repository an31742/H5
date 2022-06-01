import { PlanLayouts } from '@/layouts'

export default [
  {
    path: '/plan/facility',
    name: 'PlanFacility',
    component: () => import('views/plan/facility.vue'),
    meta: { auth: true, title: '计划任务' }
  },
  {
    path: '/plan',
    name: '',
    component: PlanLayouts,
    meta: { auth: true, title: '' },
    children: [
      {
        path: '/plan/edit/device',
        name: 'DevicePlanEdit',
        component: () => import('views/plan/editDevice.vue'),
        meta: { auth: true, title: '计划任务' }
      },
      {
        path: '/plan/edit/clean',
        name: 'CleanPlanEdit',
        component: () => import('views/plan/editClean.vue'),
        meta: { auth: true, title: '计划任务' }
      },
      {
        path: '/plan/edit/squence',
        name: 'SquencePlanEdit',
        component: () => import('views/plan/editSquence.vue'),
        meta: { auth: true, title: '计划任务' }
      },
      {
        path: '/plan/edit/quality',
        name: 'QualityPlanEdit',
        component: () => import('views/plan/editQuality.vue'),
        meta: { auth: true, title: '计划任务' }
      },
      {
        path: '/plan/result/device',
        name: 'DevicePlanResult',
        component: () => import('views/plan/resultDevice.vue'),
        meta: { auth: true, title: '查看工作结果' }
      },
      {
        path: '/plan/result/clean',
        name: 'CleanPlanResult',
        component: () => import('views/plan/resultClean.vue'),
        meta: { auth: true, title: '查看工作结果' }
      },
      {
        path: '/plan/result/decoration',
        name: 'DecorationPlanResult',
        component: () => import('views/plan/resultDecoration.vue'),
        meta: { auth: true, title: '查看工作结果' }
      },
      {
        path: '/plan/result/squence',
        name: 'SquencePlanResult',
        component: () => import('views/plan/resultSquence.vue'),
        meta: { auth: true, title: '查看工作结果' }
      },
      {
        path: '/plan/result/quality',
        name: 'QualityPlanResult',
        component: () => import('views/plan/resultQuality.vue'),
        meta: { auth: true, title: '查看工作结果' }
      },
      {
        path: '/plan/facility/clean',
        name: 'PlanFacilityClean',
        component: () => import('views/plan/facilityClean.vue'),
        meta: { auth: true, title: '计划任务' }
      },
      {
        path: '/plan/facility/sequence',
        name: 'PlanFacilitySequence',
        component: () => import('views/plan/facilitySquence.vue'),
        meta: { auth: true, title: '计划任务' }
      },
      {
        path: '/plan/facility/decoration',
        name: 'PlanFacilityDecoration',
        component: () => import('views/plan/facilityDecoration.vue'),
        meta: { auth: true, title: '计划任务' }
      },
      {
        path: '/plan/edit/decoration',
        name: 'DecorationPlanEdit',
        component: () => import('views/plan/editDecoration.vue'),
        meta: { auth: true, title: '计划任务' }
      },
      {
        path: '/plan/facility/quality',
        name: 'PlanFacilityQuality',
        component: () => import('views/plan/facilityQuality.vue'),
        meta: { auth: true, title: '计划任务' }
      }
    ]
  }
]
