import request from '@/utils/request'

/**
 * 投票及问题选项
 * id   int   Y
 */
export function minipSurveyTopic (params) {
  return request({
    url: `/minip-staff/{appId}/survey/topic`,
    method: 'get',
    params
  })
}

/**
 * 提交问题选项
 * topic_id   int   Y
 * choices   array   Y
 */
export function minipSurveyCommitAdd (data) {
  data._loading = true
  return request({
    url: `/minip-staff/{appId}/survey/commit/add`,
    method: 'post',
    data: data
  })
}

// 查看选项问题统计
// question_id
export function minipSurveyGetChoiceQuestionStats (params) {
  return request({
    url: `/minip-staff/{appId}/survey/commit/choice_question/stats`,
    method: 'get',
    params
  })
}
