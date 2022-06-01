<template>
  <FormImagesView v-if="formReadonly(opt)" :model="model" :opt="opt" />
  <div v-else class="upload-div">
    <FormUpload :model="model" :opt="opt">
      <slot>
        <div class="van-uploader__upload">
          <i class="van-icon van-icon-plus van-uploader__upload-icon"></i>
          <span class="van-uploader__upload-text">上传图片</span>
        </div>
      </slot>
    </FormUpload>
    <p v-if="formExtra(opt)" class="form-tips">{{ formExtra(opt) }}</p>
  </div>
</template>

<script>
import FormImagesView from './detail/FormImagesView'
import FormUpload from './common/FormUpload'
import mixin from './mixin'

export default {
  name: 'FormUploadImage',
  components: {
    FormUpload,
    FormImagesView
  },
  mixins: [mixin],
  props: {
    model: {
      type: Object,
      default: () => {}
    },
    opt: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {}
  },
  created () {
    // 填充默认值
    if (this.formDefaultValue(this.opt)) {
      const val = this.formDefaultValue(this.opt)

      this.$set(this.model, this.opt.code, val)
    }
  }
}
</script>
