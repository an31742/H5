<template>
  <div class="form-component-detail">
    <div v-for="(item, index) in options" :key="index">
      <!--星级评价-->
      <!--满意度评价-->
      <!--上传文件-->
      <component
        :is="item.type"
        v-if="useComponent(item)"
        :key="index"
        :model="formData"
        :opt="item"
      ></component>

      <!--图片预览-->
      <FormImagesView v-else-if="useImagePreview(item)" :model="formData" :opt="item" />
      <!-- 不适合h5展示的   -->
      <div v-else-if="useRemark(item)" class="remarkText">
        更多审批详情，请到PC端后台“物业管理平台”查看
      </div>
      <!--其他-->
      <FormTextView v-else :model="formData" :opt="item" />
    </div>
  </div>
</template>

<script>
import FormLocation from './detail/FormLocation'
import FormPosition from './detail/FormPosition'
import FormHouseInfo from './detail/FormHouseInfo'
import FormProjectInfo from './detail/FormProjectInfo'
import FormMoney from './detail/FormMoney'
import FormUploadFile from './detail/FormUploadFile'
import FormTextView from './detail/FormTextView'
import FormImagesView from './detail/FormImagesView'

import FormPurchaseInfo from './detail/warehouse/FormPurchaseInfo'

import FormIFrame from '@/views/formApprove/FormIFrame.vue'

export default {
  name: 'FromComponentsDetail',
  components: {
    FormLocation,
    FormPosition,
    FormHouseInfo,
    FormProjectInfo,
    FormMoney,
    FormUploadFile,
    FormImagesView,
    FormTextView,

    FormPurchaseInfo,
    FormIFrame
  },
  props: {
    formData: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      invisibleCodes: ['moneycount']
    }
  },
  computed: {
    // 表单项
    options () {
      console.log('this.formData[]', this.formData['frontFormLabels'])
      const opts = this.formData['frontFormLabels'] || []
      const filteredOpts = opts.filter(item => {
        return !this.invisibleCodes.includes(item.code)
      })
      return filteredOpts
    }
  },
  created () {

  },
  methods: {
    // 是否使用组件（FormHouseInfo和FormProjectInfo在H5里只展示）
    useComponent (item) {
      return [
        'FormUploadFile',
        'FormLocation',
        'FormMoney',
        'FormPosition',
        'FormHouseInfo',
        'FormProjectInfo',
        'FormPurchaseInfo',
        'FormIFrame'
      ].indexOf(item.type) > -1
    },

    // 是否使用图片
    useImagePreview (item) {
      return [
        'FormUploadImage'
      ].indexOf(item.type) > -1
    },
    // 不适合h5展示的
    useRemark (item) {
      return [
        // 考勤薪资中的组件
        'FormTableAttendance'
        // 内嵌页面
        // 'FormIFrame'
      ].includes(item.type)
    }
  }
}
</script>

<style lang="scss" scoped>
  .form-component-detail {
    font-family: PingFangSC-Regular, PingFang SC;
    .item {
      font-size: 14px;
      color: #666666;
      line-height: 20px;
      margin-bottom: 8px;
    }
  }
  .remarkText{
    margin: 10px;
    font-size: 14px;
    color: #666666;
    text-align: center;
  }
</style>
