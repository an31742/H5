<template>
  <div>
    <van-form ref="form" validate-first scroll-to-error :show-error-message="false" @submit="handleSubmit">
      <fc ref="fc" :model="formModel" :options="options" />
    </van-form>

    <div class="fw-btm-wrap btn">
      <van-button size="large round" type="primary" @click="$refs.form.submit()">确定</van-button>
    </div>
  </div>
</template>

<script>
import fc from './index'

export default {
  name: 'FromComponentsExample',
  components: { fc },
  data () {
    return {
      formModel: {},
      options: []
    }
  },
  created () {
    this.getOptions()
  },
  methods: {
    // 表单提交
    async handleSubmit (res) {
      console.log('--------------------------------')
      console.log(this.formModel)
      console.log('--------------------------------')
    },
    // 获取配置项
    getOptions () {
      // 这里需要从接口获取 && 处理数据的时候需要加 user_id
      this.options = [
        { code: 'COST', type: 'FwIsCost', name: '是否收费', required: true, readonly: 0 }
        // { code: 'JUDGE', type: 'FwJudge', name: '判断框', required: true, readonly: 0 },
        // { code: 'ROOM_ID', type: 'fwHouse', name: '选择房屋', required: true, readonly: 0 },
        // { code: 'LOCATION', type: 'fwPosition', name: '选择位置', required: true, readonly: 0 },
        // { code: 'GRID', type: 'fwGrid', name: '选择网格', required: true, readonly: 0 },
        // { code: 'PARKING', type: 'fwParking', name: '选择车位', required: true, readonly: 0 },
        // { code: 'UPLOAD_PHOTO', type: 'fwUploadPhoto', name: '上传照片', required: true, readonly: 0 },
        // { code: 'TAKE_PHOTO', type: 'fwTakePhoto', name: '拍照', required: true, readonly: 0 },
        // { code: 'UPLOAD_FILE', type: 'FwUploadFile', name: '上传附件', required: true, readonly: 0 },
        // { code: 'TEXT_AREA', type: 'FwTextArea', name: '多行文本框', required: true, readonly: 0 },
        // { code: 'INPUT', type: 'FwInput', name: '单行文本框', required: true, readonly: 0 },
        // { code: 'SIGN', type: 'FwSign', name: '签名', required: true, readonly: 0 },
        // { code: 'USER_ROLE', type: 'FwUserRole', name: '用户身份', required: true, readonly: 0 },
        // { code: 'DATE', type: 'FwDate', name: '选择日期', required: true, readonly: 0 },
        // { code: 'DATE_RANGE', type: 'FwDateRange', name: '选择日期区间', required: true, readonly: 0, isMinDate: true, initValue: [new Date('2020/01/14'), new Date('2020/01/18')] },
        // { code: 'TIME', type: 'FwTime', name: '选择时间', required: false, readonly: 0, props: { particle: 60, range: 'work_time', overtime: 10 } },
        // { code: 'DATE_TIME', type: 'FwDateTime', name: '日期时间', required: true, readonly: 0 },
        // { code: 'TIME_RANGE', type: 'FwTimeRange', name: '日期时间区间', required: false, readonly: 0, props: { particle: 60, range: 'work_time', limitDays: 7, overtime: 10 } },
        // { code: 'STAR_APPRAISE', type: 'FwStarAppraise', name: '星级评价', required: true, readonly: 0 },
        // { code: 'SATISFIED_APPRAISE', type: 'FwSatisfiedAppraise', name: '满意度评价', required: true, readonly: 0 },
        // { code: 'CAR_SELECT', type: 'FwCarSelect', name: '选择车辆', required: true, readonly: 0 },
        // { code: 'STAFF', type: 'FwStaff', name: '选择员工', required: true, readonly: 0 },
        // { code: 'STAFF_NEXT_NODE', type: 'FwStaffOnNextNode', name: '选后置节点员工', required: false, readonly: 0, props: { scope: 1 } }
      ]
    }
  }
}
</script>
