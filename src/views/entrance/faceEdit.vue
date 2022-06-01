<template>
  <div class="fw-container  --weui-BG-2">

    <div v-if="isShow" class="camera-layer">
      <div v-if="base64Img" class="img-box">
        <img :src="base64Img" />
      </div>
      <div v-else style="text-align:center;flex:1" class="flex-center" >
        <div class="flex-center ">
          <div class="box">
            <img class="icon" :src="require('@/assets/image/phone.svg')">
            <div class="text">请确保周围光线充足</div>
          </div>

          <div class="box">
            <img class="icon" :src="require('@/assets/image/light.svg')">
            <div class="text">正视前方摄像头区域</div>
          </div>

          <div class="box">
            <img class="icon" :src="require('@/assets/image/face1.svg')">
            <div class="text">确保面部无遮挡</div>
          </div>
        </div>
      </div>
      <div class="camera-bottom">
        <!-- 结果消息区 begin-->
        <div class="msg-content">
          <div v-if="uploadStatus==='fail'" class="flex-row-center">
            <svg-icon icon-class="error-icon" class="van-icon cell_icon" />
            <span>
              {{ errMsg }}
            </span>
            <span style="color:#999">
              请重新拍照
            </span>
          </div>
          <div v-if="uploadStatus==='success'" class="flex-row-center" style="margin:5px 0">
            <svg-icon icon-class="right-icon" class="van-icon cell_icon" />
            人脸录入成功
          </div>
          <div v-if="['success','init'].includes(uploadStatus)">
            <div style="margin:5px 0">
              人脸信息将适用于以下智能门禁：
            </div>
            <p>
              全部门禁
            </p>
          </div>
        </div>
        <!-- 结果消息区 end -->

        <!-- 按钮区 begin-->
        <div class="btn-c">
          <template v-if="['new','init'].includes(uploadStatus)">
            <div style="flex-direction: column; position: relative;">
              <van-uploader
                ref="uploadBtn"
                :before-read="beforeRead"
                :after-read="afterRead"
                capture="camera"
              >
                <button
                  type="button"
                  style="width: 308px"
                  class="button  button-yellow"
                >
                  {{ !base64Img ? '开始录入' : '重新录入' }}
                </button>
              </van-uploader>
              <div
                v-if="!base64Img"
                class="btn-c--agreement"
                @click="isShowAgreement = true"
              >开始录入</div>
            </div>
          </template>
          <template v-if="uploadStatus==='pending'">
            <van-uploader
              ref="uploadBtn"
              :disabled="percent>0"
              :before-read="beforeRead"
              :after-read="afterRead"
              capture="camera"
            >
              <button
                type="button"
                class="button  button-yellow"
              >
                <button type="button" class="button" @click="resetCamera">重新拍摄</button>
              </button>
            </van-uploader>
            <button type="button" class="button button-yellow" @click="handleUpload">
              上传{{ percent>0?`中${percent}%`:'' }}
            </button>
          </template>
          <template v-if="uploadStatus==='fail'">
            <van-uploader
              ref="uploadBtn"
              :before-read="beforeRead"
              :after-read="afterRead"
              capture="camera"
            >
              <button
                type="button"
                style="width: 308px"
                class="button  button-yellow"
              >
                重新拍照
              </button>
            </van-uploader>
          </template>
          <!-- 完成 -->
          <template v-if="uploadStatus==='success'">
            <button
              type="button"
              style="width: 308px"
              class="button  button-yellow"
              @click="goBack()"
            >
              确定
            </button>
          </template>
        </div>
        <!-- 按钮区 end-->
      </div>
    </div>
    <!-- 人脸录入弹窗 -->
    <van-dialog
      v-model="isShowAgreement"
      title="提示"
      :show-confirm-button="false"
      confirmButtonText="同意"
      confirm-button-color="#E1AA6C"
      cancelButtonText="拒绝"
    >
      <div class="dialog-main">
        <p class="dialog-main__text">您正在使用人脸录入功能，录入的人脸信息仅用于智能门禁人脸识别开锁。请仔细阅读<span @click="toAgreement(1)">《个人生物识别信息保护政策》</span>和<span @click="toAgreement(2)">《未成年人个人信息保护政策》</span>后，您本人/人脸图像所有者同意后，方可继续下一步操作。如您属于未成年人，未成年人上传人脸，应确保经监护人同意。</p>
        <div class="dialog-main__btn">
          <div class="dialog-main__btn--left" @click="closeDialog">拒绝</div>
          <div class="dialog-main__btn--right" @click="closeDialog">
            <van-uploader
              style="width: 100%;"
              ref="uploadBtn"
              :before-read="beforeRead"
              :after-read="afterRead"
              capture="camera"
            >
              <div
                style="width: 100%;"
              >同意</div>
            </van-uploader>
          </div>
        </div>
      </div>
    </van-dialog>
  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5'
import Compressor from 'compressorjs'
import dayjs from 'dayjs'
import { miniSecretAdd, getUploadToken, miniSecretInfo } from '@/api/entrance'

export default {
  name: 'Face',
  data () {
    return {
      dayjs,
      isShow: false,
      base64Img: '',
      file: '',
      uploadStatus: 'new',
      errMsg: '',
      percent: 0,
      isShowAgreement: false
    }
  },
  async activated () {
    this.base64Img = ''
    this.file = ''
    this.uploadStatus = 'new'
    this.errMsg = ''
    this.percent = 0

    this.uid = this.$route.query.id
    this.userName = decodeURIComponent(this.$route.query.name)
    this.mode = this.$route.query.mode
    this.groupId = this.$route.query.groupId
    if (this.mode === 'edit') {
      this.$emit('loading', true)
      const res = await miniSecretInfo({
        'staff_id': parseInt(this.uid),
        'code_type': 4,
        'group_id': parseInt(this.groupId)
      })
      if (res.code === 200) {
        if (res.data.secret_data) {
          this.uploadStatus = 'init'

          this.base64Img = res.data.secret_data.face_image_url
        }
      } else {

      }
      this.$emit('loading', false)
    }
    this.isShow = true
  },
  methods: {
    closeDialog () {
      this.isShowAgreement = false
    },
    toAgreement (type) {
      let url = 'https://sso.gmtech.top/policy_2021_12_20/policybiometrics1205-2.html'
      if (type === 2) url = 'https://sso.gmtech.top/policy_2021_12_20/policychildinfo1205-2.html'
      location.href = url
    },
    resetCamera () {
      this.isShow = false
      this.base64Img = ''
    },
    beforeRead () {
      this.isShow = false
      this.base64Img = ''
      return true
    },
    async afterRead (file) {
      this.percent = 0

      this.uploadStatus = 'pending'

      // this.$store.commit('updateLoading', true)
      // console.log('file', file)
      this.file = file.file
      // console.log('压缩前图片大小', this.file.size)

      // let files = this.dataURLtoFile(file.content, file.file.name)
      this.file = await this.compressImage(this.file)
      // this.$store.commit('updateLoading', false)
      // console.log(this.file)
      this.base64Img = await this.blobToDataURL(this.file)
      this.isShow = true
      // this.editFile(files, file)
    },
    dataURLtoFile (dataurl, filename) { // 将base64转换为文件
      const arr = dataurl.split(',')
      const mime = arr[0].match(/:(.*?);/)[1]
      const bstr = atob(arr[1])
      let n = bstr.length
      const u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new File([u8arr], filename, { type: mime })
    },
    blobToDataURL (blob) {
      return new Promise(resolve => {
        var a = new FileReader()
        a.onload = function (e) { resolve(e.target.result) }
        a.readAsDataURL(blob)
      })
    },
    // 压缩图片
    compressImage (file) {
      return new Promise(resolve => {
        const maxSize = 50 * 1024 * 1024
        const fileSize = file.size

        // 图片压缩处理标准：1.最大宽度960 2.最大5M
        let quality = maxSize / fileSize

        // 不超过maxSizeM
        if (fileSize < maxSize) {
          quality = 0.99
        }
        const ci = new Compressor(file, {
          checkOrientation: true,
          maxWidth: 960, // Math.sqrt 影响方向？
          quality: quality,
          success (res) {
            console.log('压缩后的图片大小', res.size)
            resolve(res)
          },
          error (err) {
            console.warn('压缩图片失败，使用原图上传', err)
            resolve(file)
          }
        })
        console.log('ci', ci)
      })
    },
    async handleUpload () {
      // console.log('handleUpload')
      if (this.percent > 0) {
        return
      }
      let cos = null
      const that = this
      const { file } = this
      const suffix = file.name.substr(file.name.lastIndexOf('.') + 1)

      const startUpload = (res) => {
        // console.log(res, 'res')
        cos.putObject({
          Bucket: res.bucket || 'stat-1301854395',
          Region: res.region || 'ap-nanjing',
          Key: res.file_key,
          Body: that.file,
          onProgress: function (progress) {
            if (progress) {
              that.percent = Math.floor(progress.percent * 100)
              that.$forceUpdate()
              // console.log('progress.percent', progress.percent)
              that.$store.commit('updateLoading', true)
            }
          }
        }, function (err) {
          console.log(err)
          if (err) {
            that.loading = false
            that.$toast('头像上传失败，请重试')
            return
          }

          const data = {
            uid: Number(that.uid),
            group_id: Number(that.groupId),
            user_name: that.userName,
            code_type: 4,
            user_type: 2,
            room_id: Number(that.roomId),
            expire_time: 0,
            face_image_url: res.file_key
          }
          miniSecretAdd(data)
            .then((res) => {
              that.$store.commit('updateLoading', false)

              if (res.code === 200) {
                // that.isShow = false
                that.uploadStatus = 'success'
                that.$toast('录入成功')
                // that.$router.back()
              } else if (res.code === 500) {
                // {"code":500,"msg":"fail","data":"添加秘钥失败","time":"2021-02-02 17:08:40"}
                that.uploadStatus = 'fail'
                that.errMsg = '添加失败'
                if (typeof (res.data) === 'string') {
                  that.errMsg = res.data || '添加失败'
                }
              } else {
                that.uploadStatus = 'fail'
                that.errMsg = '添加失败'
                if (typeof (res.data) === 'string') {
                  that.errMsg = res.data || '添加失败'
                }
              }
            }).catch(e => {
              that.uploadStatus = 'fail'

              that.percent = undefined
              that.$store.commit('updateLoading', false)

              console.log('err', e)
            })
        })
      }

      getUploadToken({ suffix, channel: 'fpms' }).then(res => {
        res = res.data.data || {}
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
        // cur.status = 'failed'
        that.loading = false
      })
    },
    next () {
      this.$router.push({
        name: 'entranceFaceEdit'
      })
    },
    goBack () {
      this.$router.back()
    }
  }
}
</script>

<style lang="scss" scoped>

.flex-center{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.fw-container{
  background-color: #fff;
  height: 100vh;
}
::v-deep .camera-layer {
    display: flex;
    flex-direction: column;

    justify-content: space-between;
    width: 100vw;
    height: 100%;
    .img-box {
      max-width: 100%;
      max-height:calc(100vh - 120px);
      overflow-y: scroll;
      flex: 1;
      img {
        display: block;
        width: 100%;
        margin: 0 auto;
      }
    }
    .camera-bottom {
      // position: fixed;

      bottom: 0;
      left: 0;

      width: 100%;
      box-sizing: border-box;
      background: #fff;
      color: #fff;

      p{
          line-height: 30px;
      }

      .btn-c{
        padding: 15px 0 20px 0;
        display: flex;
        flex-wrap: nowrap;
        align-content: center;
        align-items: center;
        justify-content: space-around;
      }

      .linkbtn{
        font-size: 17px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #BC8D58;
        line-height: 24px;
        margin-top:25px;
      }

      .button {
        display: block;
        width: 141px;
        height: 40px;
        border-radius: 20px;
        border: 1px solid #E1AA6C;;
         color: #E1AA6C;
        background: #fff;
        &.button-yellow {
          border: none;
          color: #fff;
          background: linear-gradient(175deg, #F2D5A5 0%, #E1AA6C 100%);
        }
      }
    }
  }

.box {
    display: flex;
    height: 70px;
    width: 300px;
    padding: 25px 50px;
    line-height: 70px;
    font-size: 15px;
    color: rgba(102, 102, 102, 1);

    .icon {
      width: 70px;
      height: 70px;
      margin-right:25px ;
    }
}
  .launch-camera {
    position: fixed;
    left: 0;
    bottom: 0;
    display: block;
    width: 300px;
    height: 40px;
    margin: 20px 38px;
  }
  .start {
    display: block;
    width: 300px;
    height: 40px;
    background: linear-gradient(86deg, #F2D5A5 0%, #E1AA6C 100%);
    border-radius: 20px;
    border: none;
    color: #fff;
  }

.msg-content{

    text-align: center;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333330;
    line-height: 20px;
    max-height: 80px;
    padding: 5px;

    display: flex;
    flex-direction: column;
    align-items: center;
    align-content: space-around;
    justify-content: space-around;
    justify-items: center;

    // height: 80px;
    p{
      color: #999999;
    }
}
.cell_icon{
  font-size: 20px;
  margin-right: 5px;
}
.flex-row-center{
  display: flex;
  justify-content: center;
  justify-items: center;
  align-content: center;
  align-items: center;
}
.dialog-main {
  box-sizing: border-box;
  padding-top: 10px;
  div, p, span {
    box-sizing: border-box;
  }
  &__text {
    text-indent: 2em;
    background-color: #F7F8FA;
    margin: 0 15px 10px 15px;
    padding: 10px 15px;
    span {
      color: #0091FF;
    }
  }
  &__btn {
    background-color: #fff;
    height: 48px;
    display: flex;
    align-items: center;
    position: relative;
    border-top: 1px solid #ebedf0;
    font-size: 16px;
    &--left {
      flex: 1;
      line-height: 48px;
      text-align: center;
      border-right: 1px solid #ebedf0;
    }
    &--right {
      flex: 1;
      line-height: 48px;
      text-align: center;
      color: #E1AA6C;
      font-weight: 500;
      ::v-deep .van-uploader__input-wrapper {
        width: 100%;
      }
    }
  }

}
.btn-c--agreement {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  line-height: 40px;
  border-radius: 20px;
  text-align: center;
  background: linear-gradient(175deg, #F2D5A5 0%, #E1AA6C 100%);
}
</style>
