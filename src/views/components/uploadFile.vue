<template>
  <div style="position: relative;">
    <van-uploader
      v-model="fileItems"
      name="file"
      upload-icon="plus"
      :accept="accept"
      :max-count="max"
      :disabled="disabled"
      :deletable="!disabled"
      :upload-text="uploadText"
      :before-read="beforeRead"
      :after-read="afterRead"
      :style="uploadStyle"
      :previewOptions="{ closeable: true }"
      @delete="deleteFile"
    >
    </van-uploader>
    <div class="upload-tips">(单张照片不超过{{ maxPerSize }}M，最多只可上传{{ max }}张)</div>
  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5'
import Compressor from 'compressorjs'
import { getTecentUploadToken } from '@/api/common'
export default {
  name: 'UploadComponent',
  props: {
    accept: { // 允许文件类型
      type: String,
      default: () => 'image/jpg,image/png,image/jpeg'
    },
    max: {
      type: Number,
      default: () => 100
    },
    uploadText: {
      type: String,
      default: () => '上传图片'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    fileList: {
      type: Array,
      default () {
        return []
      }
    },
    previewOptions: {
      type: Object,
      default: () => {}
    },
    uploadStyle: {
      type: String,
      default: 'padding: 16px 10px 6px 16px'
    }
  },
  data () {
    return {
      file: null,
      curIndex: 0,
      fileItems: [],
      loading: false,
      maxPerSize: 20 // 单张照片最大尺寸（单位: M）
    }
  },
  computed: {
    /*
    * 已经上传的图片列表
    *   这里之所以要向外emit属性uploadedPictures，不直接emit属性fileItems
    *   是因为：如果直接给fileItems赋值url，页面上的预览就会去网络请求url，可能会出现"暂时无法查看"或者"加载失败"的情况
    *   所以：fileItems里不给赋值url，预览本地的blob，但是向外emit的时候，需要把腾讯云上的图片url带上
    * */
    uploadedPictures () {
      const arr = JSON.parse(JSON.stringify(this.fileItems))

      return arr.map(item => {
        item.url = item.image_url || item.url
        item.orgUrl = item.orgUrl || item.url

        // 删除属性 content file message image_url
        const listKey = ['content', 'file', 'message', 'image_url']
        listKey.forEach(key => {
          delete item[key]
        })

        return item
      })
    }
  },
  watch: {
    fileList (val) {
      // 这里要先判断下，新旧的列表url是否相同，否则可能会引起循环监听
      if (!this.isSamePictures(val, this.fileItems)) {
        this.fileItems = val || []
      }
    }
  },
  created () {
    this.fileItems = this.fileList
  },
  methods: {
    // 判断两组图片是否一样
    isSamePictures (arr, list) {
      const a = arr.filter(i => i).map(item => item.image_url || item.url || item.orgUrl || item)
      const b = list.filter(i => i).map(item => item.image_url || item.url || item.orgUrl || item)

      return a.toString() === b.toString()
    },
    // 上传前校验
    beforeRead (file) {
      if (this.loading) {
        this.$toast('请等待图片上传完成')
        return false
      }

      const type = file.type.substr(file.type.indexOf('/') + 1)
      console.log(file)
      if (this.accept === '*') {
        return true
      }
      if (!type || this.accept.indexOf(type) < 0) {
        this.$toast('请上传' + this.accept.replace(/image\//g, '') + '后缀的文件')
        return false
      }
      if (file.size > this.maxPerSize * 1024 * 1024) {
        this.$toast('请上传不大于' + this.maxPerSize + 'M的图片')
        return false
      }

      return true
    },
    // 删除
    deleteFile (file) {
      this.file = null
      this.curIndex = 0
      this.$emit('change', this.uploadedPictures)
    },
    // 文件上传
    afterRead (file, detail) {
      this.curIndex = detail.index
      file.status = 'uploading'
      this.loading = true
      this.file = file.file
      this.compressImage(file)
    },
    // 压缩图片
    compressImage (cur) {
      const that = this
      const { file } = this
      const maxSize = 2097152
      const fileSize = file.size

      // 不超过2M不压缩
      if (fileSize < maxSize) {
        that.handleUpload(cur)
        return
      }

      // 图片压缩处理标准：1.最大宽度1080 2.最大2M
      const quality = maxSize / fileSize
      const { handleUpload } = this
      const ci = new Compressor(file, {
        // maxWidth: 1080,
        quality: Math.sqrt(quality),
        success (res) {
          that.file = res
          handleUpload(res)
        },
        error (err) {
          console.warn('压缩图片失败，使用原图上传', err)
          handleUpload(cur)
        }
      })
      console.log('ci', ci)
    },
    // 上传文件
    handleUpload (cur) {
      let cos = null
      const that = this
      const { file } = this
      const suffix = file.name.substr(file.name.lastIndexOf('.') + 1)

      const startUpload = (res) => {
        cos.putObject({
          Bucket: res.bucket || 'fpms-1301854395',
          Region: res.region || 'ap-nanjing',
          Key: res.filekey,
          Body: that.file,
          onProgress: function (progress) {
            if (progress && progress.percent === 1) {
              cur.status = 'done'
              that.loading = false

              // url后面加参数filename，方便回填的时候显示
              const name = that.file && that.file.name || ''
              const url = `${res.url}/${res.filekey}?filename=${encodeURIComponent(name)}`

              that.fileItems[that.curIndex].image_url = url
              that.fileItems[that.curIndex].name = name
              that.fileItems[that.curIndex].status = 'done'
              that.fileItems[that.curIndex].orgUrl = `${res.url}/${res.filekey}?filename=${encodeURIComponent(name)}`

              that.$emit('change', that.uploadedPictures)
            }
          }
        }, function (err) {
          if (err) {
            cur.status = 'failed'
            that.loading = false
            that.$toast('文件上传失败，请重试')
          }
        })
      }

      getTecentUploadToken({ suffix }).then(res => {
        res = res.data || {}
        cos = new COS({
          getAuthorization: (opt, callback) => {
            const data = {
              TmpSecretId: res.token.TmpSecretId,
              TmpSecretKey: res.token.TmpSecretKey,
              XCosSecurityToken: res.token.Token,
              StartTime: res.start_time,
              ExpiredTime: res.expired_time
            }
            callback(data)
          }
        })
        startUpload(res)
      }).catch(_ => {
        cur.status = 'failed'
        that.loading = false
      })
    }
  }
}
</script>

<style type="text/css" lang="scss">
  .van-uploader__upload-icon { color: rgba(220, 220, 220, 1); }
  .van-uploader__upload-text { font-size: 12px;font-family: PingFangSC-Regular,PingFang SC;color: rgba(196,196,196,1);line-height: 17px; }
  .van-uploader__wrapper {
    display: flex;
    .van-uploader__preview, .van-uploader__upload {
      width: 100px;height: 100px;background: #fafafa;border-radius: 4px;position: relative;margin: 0 14px 8px 0;
    }
    .van-uploader__preview-delete { top: 5px !important;right: 5px !important;opacity: 0.6;font-size: 18px;width: 16px;height: 16px;border-radius: 100%;border: 1px solid #fff; }
    .van-uploader__preview-delete-icon {
      transform: scale(1);
      top: 2px;
      left: 2px;
      font-size: 12px;
      right: 0;
      line-height: 12px;
    }
    .van-uploader__preview-image { width: 100%; height: 100%;border-radius: 4px; }
    /*.van-uploader__preview-delete { top: 5px !important;right: 5px !important;opacity: 0.6; }
    .van-uploader__preview-image { width: 100%; height: 100%; }*/
  }
  .dashed .van-uploader__upload { border: 1px dashed #ccc; }
  .upload-tips { font-size: 10px;font-weight: 400;color: #C4C4C4;line-height: 14px; }
</style>
