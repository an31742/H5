<template>
  <div class="form-component-detail">
    <div v-for="(item, index) in options" :key="index" class="item">
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
      <FwImagesView v-else-if="useImagePreview(item)" :model="formData" :opt="item" />

      <!--其他-->
      <FwTextView v-else :model="formData" :opt="item" />

    </div>
  </div>
</template>

<script>
import FwUploadFile from './preview/FwUploadFile'

import FwStarAppraise from './preview/FwStarAppraise'
import FwSatisfiedAppraise from './preview/FwSatisfiedAppraise'

import FwTextView from './preview/FwTextView'

import FwImagesView from './preview/FwImagesView'
import FwUploadVideo from './preview/FwUploadVideo.vue'

export default {
  name: 'FromComponentsDetail',
  components: {
    FwSatisfiedAppraise,
    FwStarAppraise,
    FwUploadFile,
    FwImagesView,
    FwTextView,
    FwUploadVideo
  },
  props: {
    formData: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {

    }
  },
  computed: {
    // 表单项
    options () {
      return this.formData['frontFormLabels'] || []
    }
  },
  created () {

  },
  methods: {
    // 是否使用组件
    useComponent (item) {
      return [
        'FwStarAppraise',
        'FwSatisfiedAppraise',
        'FwUploadFile',
        'FwUploadVideo'
      ].indexOf(item.type) > -1
    },

    // 是否使用图片
    useImagePreview (item) {
      return [
        'FwTakePhoto',
        'FwUploadPhoto',
        'FwSign'
      ].indexOf(item.type) > -1
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
</style>
