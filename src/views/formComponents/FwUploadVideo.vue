<!--
  功能：功能描述
  作者：Roy Li
  邮箱：lirong@aiforward.com
  时间：2022年04月20日 15:10:24
-->
<template>
  <div>
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
    <div class="van-uploader van-cell">
      <div class="van-uploader__wrapper">
        <div v-for="(i, k) in fileList" :key="k" class="van-uploader__upload">
          <iframe v-if="i.url" :src="i.url" style="height:100%;width:100%;"/>
          <div class="van-uploader__input" @click="onclickPreview(i.url)"></div>
          <van-icon class="custom-van-uploader__preview-delete" name="cross" @click="deleteItem(k)" />
        </div>
        <div class="van-uploader__upload" v-if="fileList.length<maxCount">
          <i class="van-icon van-icon-photograph van-uploader__upload-icon"></i>
          <van-uploader
            id="uploadVideo"
            ref="input"
            name="file"
            v-model="fileList"
            class="van-uploader__input"
            accept="video/*"
            result-type="file"
            :capture="null"
            :max-count="maxCount"
            :max-duration="30"
            :max-size="maxSize"
            :after-read="onChange"
            :preview-image="false"
          >
          </van-uploader>
        </div>
      </div>
    </div>
    <van-overlay :show="show" @click="show = false">
      <div class="wrapper">
        <iframe v-if="currentUrl" :src="currentUrl" style="height:50%;width:80%;"/>
      </div>
    </van-overlay>
  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5'
import { getTecentUploadToken } from '@/api/common'
import mixin from './mixin'
import videoPlayer from '@/views/components/video.vue'
export default {
  // 组件名称
  name: 'FwUploadViedo',
  // 组件参数 接收来自父组件的数据
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
    }
  },
  mixins: [mixin],
  // 局部注册的组件
  components: {
    videoPlayer
  },
  // 组件状态值
  data () {
    return {
      maxCount: 5,
      selfUpload: null,
      file: null,
      show: false,
      currentUrl: '',
      fileList: [],
      curIndex: 0,
      maxSize: 20 * 1024 * 1024
    }
  },
  // 计算属性
  computed: {
    // 展示数量
    showCount () {
      const list = this.model[this.opt.code] || []
      return `${list.length} / ${this.maxCount}`
    }
  },
  // 侦听器
  watch: {
    fileList: {
      handler (newData, oldData) {
        // newData = newData.map(val => {
        //   return {
        //     file: val.file,
        //     message: val.message,
        //     status: val.status
        //   }
        // })
        const arr = newData.map(item => item.url)
        this.$set(this.model, this.opt.code, arr)
        this.$set(this.model, `${this.opt.code}_files`, newData)
        this.$emit('change', newData)
      },
      deep: true
    }

  },
  // 组件方法
  methods: {
    isObject (val) {
      return Object.prototype.toString.call(val) === '[object Object]'
    },
    toArray (item) {
      if (Array.isArray(item)) {
        return item
      }
      return [item]
    },
    deleteItem (k) {
      this.fileList.splice(k, 1)
    },
    onChange (event, detail) {
      if (!event.file) return
      var result = {
        file: event.file,
        status: '',
        message: ''
      }

      this.afterRead(result.file, detail)
    },
    onclickPreview (url) {
      // console.log(11111, url)
      if (!url) return
      this.show = true
      this.currentUrl = url || ''
    },
    afterRead (file, detail) {
      this.file = file
      this.curIndex = detail.index
      this.handleUpload(file, detail)
    },
    // 上传文件
    handleUpload (cur) {
      let cos = null
      const that = this
      const { file, curIndex } = this
      const suffix = file.name.substr(file.name.lastIndexOf('.') + 1)
      this.$store.commit('updateLoading', true)

      const startUpload = (res) => {
        cos.putObject({
          Bucket: res.bucket || 'fpms-1301854395',
          Region: res.region || 'ap-nanjing',
          Key: res.filekey,
          Body: that.file,
          onProgress: async function (progress) {
            console.log('progress', progress)
            if (progress && progress.percent === 1) {
              // url后面加参数filename，方便回填的时候显示
              const name = that.file && that.file.name || ''
              const url = `${res.url}/${res.filekey}`

              // //  创建video 标签
              const video = document.createElement('video')
              //   给video的src赋值
              video.src = url
              that.$store.commit('updateLoading', true)
              //  视频加载完获取时间
              that.fileList[curIndex].thumb = url
              that.fileList[curIndex].url = url
              that.fileList[curIndex].name = name
              that.fileList[curIndex].status = 'done'
              that.fileList[curIndex].isVideo = true
              that.fileList[curIndex].type = 'video'
              that.fileList[curIndex].status = 'done'
              that.fileList[curIndex].orgUrl = `${res.url}/${res.filekey}`

              that.$store.commit('updateLoading', false)
            }
          }
        }, function (err) {
          if (err) {
            that.$store.commit('updateLoading')
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
        that.$toast('文件上传失败，请重试')
      })
    }

  },

  // 以下是生命周期钩子   注：没用到的钩子请自行删除
  /**
  * 在实例初始化之后，组件属性计算之前，如data属性等
  */
  beforeCreate () {
  },
  /**
  * 组件实例创建完成，属性已绑定，但DOM还未生成，$ el属性还不存在
  */
  created () {
    console.log('上传视频组件初始化完成')
  },
  /**
  * 在挂载开始之前被调用：相关的 render 函数首次被调用。
  */
  beforeMount () {
  },
  /**
  * el 被新创建的 vm.$ el 替换，并挂载到实例上去之后调用该钩子。
  * 如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.$ el 也在文档内。
  */
  mounted () {
  },
  /**
  * 数据更新时调用，发生在虚拟 DOM 重新渲染和打补丁之前。
  * 你可以在这个钩子中进一步地更改状态，这不会触发附加的重渲染过程。
  */
  beforeUpdate () {
  },
  /**
  * 由于数据更改导致的虚拟 DOM 重新渲染和打补丁，在这之后会调用该钩子。
  * 当这个钩子被调用时，组件 DOM 已经更新，所以你现在可以执行依赖于 DOM 的操作。
  */
  updated () {
  },
  /**
  * keep-alive 组件激活时调用。 仅针对keep-alive 组件有效
  */
  activated () {
  },
  /**
  * keep-alive 组件停用时调用。 仅针对keep-alive 组件有效
  */
  deactivated () {
  },
  /**
  * 实例销毁之前调用。在这一步，实例仍然完全可用。
  */
  beforeDestroy () {
  },
  /**
  * Vue 实例销毁后调用。调用后，Vue 实例指示的所有东西都会解绑定，
  * 所有的事件监听器会被移除，所有的子实例也会被销毁。
  */
  destroyed () {
  }
}
</script>

<style lang="scss" scoped>
  .preview-cover {
    position: absolute;
    bottom: 0;
    box-sizing: border-box;
    width: 100%;
    padding: 4px;
    color: #fff;
    font-size: 12px;
    text-align: center;
    background: rgba(0, 0, 0, 0.3);
  }
  .custom-van-uploader {
    border: 1px solid red;
  }
  .custom-van-uploader__preview-delete {
    position: absolute;
    top: 2px;
    right: 2px;
    color: #fff;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
  }
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
</style>
