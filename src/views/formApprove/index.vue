<template>
  <div class="form-component">
    <template v-for="(item, index) in options">
      <template v-if="item.visibility===3||invisible(item)"></template>
      <component
        :is="item.type"
        v-else
        :key="index"
        :class="{readonly: item.visibility===1}"
        :model="model"
        :opt="item"
        :launcherId="launcherId"
      ></component>
    </template>
  </div>
</template>

<script>
import FormRadioBox from './FormRadioBox'
import FormSelect from './FormSelect'
import FormMoney from './FormMoney'
import FormDatetime from './FormDatetime'
import FormCheckbox from './FormCheckbox'
import FormUploadImage from './FormUploadImage'
import FormUploadFile from './FormUploadFile'
import FormTextArea from './FormTextArea'
import FormLocation from './FormLocation'
import FormRangePicker from './FormRangePicker'
import FormProceduleSelect from './FormProceduleSelect'
import FormLinkOrganize from './FormLinkOrganize'
import FormLinkStaff from './FormLinkStaff'
import FormPosition from './FormPosition'
import FormInput from './FormInput'
import FormVacationType from './vacation/FormVacationType'
import FormVacationDuration from './vacation/FormVacationDuration'
import FormExtraWorkDuration from './vacation/FormExtraWorkDuration'
import FormTodoAuth from './vacation/FormTodoAuth'
import FormAddClass from './vacation/FormAddClass'
import FormPurchaseInfo from './detail/warehouse/FormPurchaseInfo'

import FormIFrame from './FormIFrame.vue'
// 补卡使用的
import FormAddClass2 from './vacation/FormAddClass2'

export default {
  name: 'FromComponentsIndex',
  components: {
    FormTextArea,
    FormLocation,
    FormRangePicker,
    FormProceduleSelect,
    FormLinkOrganize,
    FormLinkStaff,
    FormPosition,
    FormUploadImage,
    FormUploadFile,
    FormInput,
    FormRadioBox,
    FormCheckbox,
    FormSelect,
    FormMoney,
    FormDatetime,
    FormVacationType,
    FormVacationDuration,
    FormExtraWorkDuration,
    FormTodoAuth,
    FormAddClass,
    FormPurchaseInfo,
    FormIFrame,
    FormAddClass2
  },
  props: {
    model: {
      type: Object,
      default: () => {}
    },
    options: {
      type: Array,
      default: () => []
    },
    launcherId: {
      type: Number,
      default: () => 0
    }
  },
  data () {
    return {
      invisibleCodes: ['moneycount'],
      // h5 不展示的控件
      invisibleTypes: [
        // 内嵌页面
        // 'FormIFrame',
        'FormTableAttendance',
        'FormPersonLending',
        'FormPersonBorrow',
        'FormDeduction',
        'FormPersonSettingPlan'
      ]
    }
  },
  created () {
    // console.log(this.options, 'options')
    // console.log(this.model, 'model')
  },
  methods: {
    invisible (item) {
      return this.invisibleCodes.includes(item.code) ||
          this.invisibleTypes.includes(item.type)
    }
  }
}
</script>

<style type="text/css" lang="less">
  @import "./common.less";
</style>
