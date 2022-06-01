<template>
  <FormUploadFileView v-if="formReadonly(opt)" :model="model" :opt="opt" />
  <div v-else class="upload-div">
    <FormUpload
      ref="upload"
      :model="model"
      :opt="opt"
      accept=""
      ext="_files"
      uploadStyle="padding: 0;"
    >
      <div slot class="slot-preview">
        <svg-icon icon-class="upload-plus" />
        <span class="van-uploader__upload-text">添加附件</span>
      </div>

      <template #preview-cover="{ item }">
        <div class="preview-item" @click="previewFile(item)">
          <div class="icon">
            <svg-icon icon-class="upload-file" />
          </div>

          <div class="expand van-ellipsis">
            {{ item.name }}
          </div>

          <div v-if="!formReadonly(opt)" class="status" :class="'status-' + item.status" @click.stop="statusClick(item)">
            {{ item.status | statusFilter }}
          </div>
        </div>
      </template>
    </FormUpload>
    <p v-if="formExtra(opt)" class="form-tips">{{ formExtra(opt) }}</p>
  </div>
</template>

<script>
import FormUploadFileView from './detail/FormUploadFile'
import FormUpload from './common/FormUpload'
import mixin from './mixin'

export default {
  name: 'FormUploadFile',
  components: {
    FormUpload,
    FormUploadFileView
  },
  filters: {
    statusFilter (status) {
      const map = {
        done: '移除',
        failed: '上传失败',
        uploading: '上传中...'
      }

      return map[status] || ''
    }
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
  },
  methods: {
    statusClick (item) {
      if (['done', 'failed'].indexOf(item.status) > -1) {
        this.$refs.upload.deleteFileByIndex(item.index)
      }
    },
    previewFile (item) {
      const url = item.url || item.orgUrl || ''
      const imgs = ['jpg', 'jpeg', 'png', 'gif']
      const ext = url.substr(url.lastIndexOf('.') + 1)
      if (imgs.indexOf(ext) < 0) {
        this.$toast('请前往PC端查看')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  ::v-deep .slot-preview {
    width: 100%;font-size: 0;padding: 10px 16px;
    .svg-icon {
      font-size: 19px;
      background: #FAF7F4;
      border-radius: 4px;
      padding: 11px;
    }
    .van-uploader__upload-text {
      font-size: 14px;
      font-weight: 400;
      color: #BC8D58;
      line-height: 40px;
      position: absolute;
      display: inline-block;
      width: 200px;
      padding-left: 8px;
      margin-top: 0;
    }
  }
  ::v-deep .upload-wrap {
    padding: 0;
    .van-uploader {
      display: block;
      .van-uploader__preview {
        width: 100%;
        display: block;
        margin: 0;
        background: #f5f5f5;
        height: 60px;
        border-radius: 0;
        &:not(:last-child) {
          padding-bottom: 1px;
        }
        .van-uploader__preview-image {
          background: #fff;border-radius: 0;
        }
        .van-image__img {
          display: none;
        }
        .van-uploader__mask {
          display: none;
        }
        .van-uploader__file {
          width: 100%;height: 60px;background: #fff;
          .van-uploader__file-icon, .van-uploader__file-name {
            display: none;
          }
        }
        .van-uploader__preview-delete {
          display: none;
        }
      }
    }

    .van-image__loading {
      background: #fff;
      .van-image__loading-icon {
        display: none;
      }
    }

    .preview-item {
      display: flex;
      padding: 10px 16px 0;
      font-size: 14px;
      color: #333333;
      line-height: 20px;
      align-items: center;
      .svg-icon {
        font-size: 40px;
      }
      .expand {
        flex: 1;
        padding: 0 12px 0 8px;
      }
      .status {
        color: #999999;
        &.status-done, &.status-failed {
          color: #FA5151;
        }
      }
    }
  }
  ::v-deep {
    .van-image__error {
      display: none !important;
    }
  }
</style>
