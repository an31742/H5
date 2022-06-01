
const _TypeObj = {
  SurveyQuestionTypeSingle: {
    label: '单选',
    value: 1
  }, //
  SurveyQuestionTypeMultiple: {
    label: '多选',
    value: 2
  }, //, //
  SurveyQuestionTypeUserInput: {
    label: '填空',
    value: 3
  }, //, //
  SurveyQuestionTypeSingleInstant:
    {
      label: '投票单选',
      value: 4
    },

  SurveyQuestionTypeMultipleInstatnt:
    {
      label: '投票多选',
      value: 5
    },

  SurveyQuestionTypeJudegement:
     {
       label: '判断',
       value: 6
     },
  SurveyQuestionTypeImage:
     {
       label: '图片',
       value: 7
     }

}

export function getSurveyQuestionTypeText (val) {
  const item = Object.values(_TypeObj).find(t => t.value === val)
  if (item) {
    return item.label
  }
  return ''
}
export const TypeObj = _TypeObj
