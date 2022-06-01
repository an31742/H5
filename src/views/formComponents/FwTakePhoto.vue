<template>
  <FwUpload :model="model" :opt="opt" capture="camera">
    <slot>
      <div class="van-uploader__upload">
        <svg-icon icon-class="camera" class="camera" style="font-size: 28px;" />
        <span class="van-uploader__upload-text" style="padding-top: 0">拍照上传</span>
      </div>
    </slot>
  </FwUpload>
</template>

<script>
import FwUpload from './common/FwUpload'

export default {
  name: 'FwTakePhoto',
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
