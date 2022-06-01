<template>
  <FwUpload :model="model" :opt="opt">
    <slot>
      <div class="van-uploader__upload">
        <i class="van-icon van-icon-plus van-uploader__upload-icon"></i>
        <span class="van-uploader__upload-text">上传图片</span>
      </div>
    </slot>
  </FwUpload>
</template>

<script>
import FwUpload from './common/FwUpload'

export default {
  name: 'FwUploadPhoto',
  components: {
    FwUpload
  },
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
  }
}
</script>
