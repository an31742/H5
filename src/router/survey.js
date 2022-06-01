export default [

  {
    path: '/survey/add',
    name: 'SurveyAdd',
    component: () => import('views/survey/add.vue'),
    meta: { auth: true, title: '参与问卷调查' }
  }
]
