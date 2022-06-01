<template>
  <div class="file-wrap">
    <FormUpload
      ref="upload"
      :model="model"
      :opt="opt"
      mode="view"
      accept=""
      ext="_files"
      uploadStyle="padding: 0;"
    >
      <div slot class="slot-preview"></div>

      <template #preview-cover="{ item }">
        <div class="preview-item" @click="previewFile(item)">
          <div class="icon">
            <svg-icon icon-class="upload-file" />
          </div>

          <div class="expand van-ellipsis">
            {{ item.name }}
          </div>
        </div>
      </template>
    </FormUpload>
  </div>
</template>

<script>
import FormUpload from '../common/FormUpload'

export default {
  name: 'FormUploadFile',
  components: {
    FormUpload
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
    display: none;
  }

  .file-wrap {
    background: #fff;
    box-sizing: border-box;
    padding: 16px 16px 0 16px;
    border-bottom: 0.02667rem solid #EFEFEF;
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
          padding-top: 1px;
          padding-bottom: 0 !important;
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
      padding: 10px 0 0;
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

  // 只读状态
  .readonly.file-wrap {
    padding-left: 0;
    padding-right: 0;
    ::v-deep .light-title.van-field {
      padding-left: 16px;
    }
  }
</style>
