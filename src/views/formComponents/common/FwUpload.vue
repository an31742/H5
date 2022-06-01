<template>
  <div class="item-space" :class="{'is-view': mode === 'view'}">
    <van-field
      v-model="selfUpload"
      clickable
      name="selfUpload"
      input-align="right"
      class="fw-field bdn light-title"
      :label="formLabel(opt)"
      :readonly="formReadonly(opt)"
      :placeholder="formLabel(opt, '请上传')"
      :required="formRequired(opt)"
      :rules="formRules(opt, '请上传')"
    >
      <span slot="extra" class="extra">{{ showCount }}</span>
    </van-field>
    <upload
      ref="upload"
      :hideTips="true"
      :fileList="initFiles"
      :uploadStyle="uploadStyle"
      :disabled="formReadonly(opt)"
      :max="maxCount"
      @change="changeFiles"
      :capture="capture"
      :accept="accept"
    >
      <slot></slot>

      <template #preview-cover="{ item }">
        <slot name="preview-cover" :item="item"></slot>
      </template>
    </upload>
  </div>
</template>

<script>
import mixin from '../mixin'
import upload from '@/views/components/upload_form'

export default {
  name: 'FwUpload',
  components: {
    upload
  },
  mixins: [mixin],
  props: {
    model: {
      type: Object,
      default: () => {}
    },
    mode: {
      type: String,
      default: () => 'edit'
    },
    opt: {
      type: Object,
      default: () => {}
    },
    capture: {
      type: String,
      default: () => null
    },
    accept: { // 允许文件类型
      type: String,
      default: () => 'image/*'
    },
    uploadStyle: {
      type: String,
      default: () => 'padding: 16px 2px 8px 16px;'
    },
    ext: { // 该字段是为了提交表单的时候存储原始数据加的后缀名
      type: String,
      default: () => '_imgs'
    }
  },
  data () {
    return {
      selfUpload: null,
      maxCount: 5,
      androidAttrs: undefined
    }
  },
  computed: {
    // 展示数量
    showCount () {
      const list = this.model[this.opt.code] || []
      return `${list.length} / ${this.maxCount}`
    },
    // 回填
    initFiles () {
      if (this.model && this.model[this.opt.code]) {
        return this.model[this.opt.code]
      }
      return []
    }
  },
  created () {
    // 在页面一进来时就去判断当前使用机型
    const model = navigator.userAgent
    // 判断是否是安卓手机，是则是true
    this.androidAttrs = model.indexOf('Android') > -1 || model.indexOf('Linux') > -1
    console.log(999999)
    console.log('是否是安卓设备')
    console.log(this.androidAttrs)
  },
  methods: {
    // 图片列表
    changeFiles (list = []) {
      // 附件上传的时候，取orgUrl，图片取压缩后的url
      const field = this.ext === '_files' ? 'orgUrl' : 'url'
      const arr = list.length ? list.map(item => item[field]) : ''

      this.selfUpload = JSON.stringify(arr)
      this.$set(this.model, this.opt.code, arr)
      this.$set(this.model, this.opt.code + this.ext, list)

      this.$emit('change', list)
    },
    // 删除文件
    deleteFileByIndex (index) {
      this.$refs.upload.deleteFileByIndex(index)
    }
  }
}
</script>

<style lang="scss" scoped>
  .item-space { text-align: left;margin-bottom: 12px; }
  .light-title {
    padding-bottom: 4px !important;margin-bottom: 0 !important;
    background: transparent;
    ::v-deep &.van-field {
      padding-top: 0 !important;
      .extra, .van-field__label, .van-field__value {
        font-size: 13px;
        font-weight: 400;
        color: #999999;
        line-height: 17px;
        margin-bottom: 0;
        .van-field__control {
          display: none;
        }
      }
      .extra {
        padding-left: 20px;
      }
      &.van-field--error {
        .van-field__value {
          .van-field__control {
            display: block;
          }
        }
      }
    }
  }

  .is-view {
    .light-title.van-field {
      padding: 0;
      .extra { display: none; }
      ::v-deep .van-field__label { color: #666 !important;font-size: 14px !important; }
    }
  }
</style>
