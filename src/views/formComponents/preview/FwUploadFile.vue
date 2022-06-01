<template>
  <FwUpload
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
      <div class="preview-item">
        <div class="icon">
          <svg-icon icon-class="upload-file" />
        </div>

        <div class="expand van-ellipsis">
          <span v-if="isImage(item.url)">{{ item.name }}</span>
          <a v-else style="color: #333333;display: block;line-height: 44px;" :href="item.url" target="_blank">{{ item.name }}</a>
        </div>
      </div>
    </template>
  </FwUpload>
</template>

<script>
import FwUpload from '../common/FwUpload'

export default {
  name: 'FwTakePhoto',
  components: {
    FwUpload
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
    isImage (url) {
      const imgReg = /\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/
      return imgReg.test(url)
    }
  }
}
</script>

<style lang="scss" scoped>
  ::v-deep .slot-preview {
    display: none;
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
        padding-bottom: 4px;
        border-radius: 0;
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
</style>
