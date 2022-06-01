<template>
  <!-- 环境的拍照签到扫码签到 -->
  <div class="facility">
    <div class="facility-header">
      <p class="facility-back facility-flex">
        <svg-icon icon-class="arrow-left-back" style="font-size:14px;"></svg-icon>
        <span @click="$router.back()">返回</span>
      </p>
      <p>
        <span class="facility-now">{{ facilityNow + 1 }}</span>
        <span class="facility-total">/{{ facilityTotal }}</span>
      </p>
    </div>
    <div class="facility-content">
      <p class="facility-name">{{ facilityName }}</p>
      <!-- 模拟设备占位 -->
      <div v-if="taskInfo.checkin_scan_code && !hasCheckQrcode" class="facility-image">
        <img :src="require('@/assets/image/default_cleaning.png')" />
      </div>
      <div v-else-if="taskInfo.checkin_photo && hasCheckQrcode" class="facility-image">
        <img :src="require('@/assets/image/default_sequence.png')" />
      </div>
    </div>
    <div class="facility-button">
      <van-button
        v-if="!taskInfo.checkin_scan_code && !taskInfo.checkin_photo"
        style="font-size:18px;height:40px;"
        round
        block
        type="primary"
        color="linear-gradient(176deg, #F2D5A5 0%, #E1AA6C 100%)"
        @click="goEdit"
      >
        处理
      </van-button>
      <!--扫码签到-->
      <van-button
        v-if="taskInfo.checkin_scan_code && !hasCheckQrcode"
        style="font-size:18px;height:40px;"
        round
        block
        type="primary"
        color="linear-gradient(176deg, #F2D5A5 0%, #E1AA6C 100%)"
        @click="buttonTap"
      >
        扫码签到
      </van-button>
      <!--拍照签到-->
      <upload
        v-if="taskInfo.checkin_photo && hasCheckQrcode"
        ref="upload"
        :max="1"
        :hideTips="true"
        uploadStyle="padding: 0"
        capture="camera"
        @change="(list) => { changeFiles(list) }"
        @loading="uploading"
      >
        <slot>
          <van-button
            style="font-size:18px;height:40px;"
            round
            block
            type="primary"
            color="linear-gradient(176deg, #F2D5A5 0%, #E1AA6C 100%)"
          >
            拍照签到
          </van-button>
        </slot>

        <template #preview-cover="{ item }">
          <van-button
            style="font-size:18px;height:40px;"
            round
            block
            type="primary"
            color="linear-gradient(176deg, #F2D5A5 0%, #E1AA6C 100%)"
          >
            拍照签到
          </van-button>
        </template>
      </upload>
    </div>

    <van-overlay :show="pageLoading">
      <div class="wrapper">
        <van-loading/>
      </div>
    </van-overlay>
  </div>
</template>

<script>
import { minipCleaningTaskInfo } from '@/api/task'
import upload from '@/views/components/upload_form'
import { isApp } from '@/utils/index'
import wx from 'weixin-js-sdk'

export default {
  name: 'PlanFacilityClean',
  components: {
    upload
  },
  data () {
    return {
      recordId: '',
      taskId: '',
      point_id: '',
      facilityName: '',
      taskInfo: {},
      facilityNow: 0, // 当前设备
      hasCheckQrcode: false, // 是否已经扫码签到
      facilityTotal: 0, // 设备总数
      pageLoading: false,
      facilityQrCode: ''
    }
  },
  mounted () {
    this.taskId = this.$route.query.id || ''
    this.recordId = this.$route.query.orderId || ''
    this.point_id = this.$route.query.point_id || ''
    this.init()
  },
  methods: {
    // 扫码签到
    buttonTap () {
      const qc = this.facilityQrCode
      if (isApp()) {
        this.nativeScanQRcode((res) => {
          if (res.error) {
            this.$toast(res.error)
            return
          }
          setTimeout(() => {
            if (res && res.str === qc) {
              this.scanSuccess()
            } else {
              this.$toast('签到点位与扫描点位不一致，请重新扫描')
            }
          }, 1000)
        })
      } else {
        wx.scanQRCode({
          needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
          scanType: ['qrCode', 'barCode'],
          success: (res) => {
            // https://developers.weixin.qq.com/community/develop/doc/00040aa59e828087e59a70e2b51c00
            setTimeout(() => {
              if (res && res.resultStr === qc) {
                this.scanSuccess()
              } else {
                this.$toast('签到点位与扫描点位不一致，请重新扫描')
              }
            }, 1000)
          },
          error: () => {
            this.$toast('扫码失败')
          }
        })
      }
    },
    // 初始化
    init () {
      this.loadding = true
      // 任务详情
      let params = {
        id: this.taskId
      }
      if (this.recordId) {
        params = { work_order_record_id: this.recordId }
      }

      minipCleaningTaskInfo(params).then(res => {
        if (res.code === 200) {
          this.taskInfo = res.data
          // eslint-disable-next-line
          const { location_points } = (res.data['cleaning_group'] || {})
          this.facilityNow = this.taskNowInd(location_points)
          this.facilityName = location_points[this.facilityNow].name
          this.facilityQrCode = location_points[this.facilityNow].qr_code
          this.facilityTotal = location_points.length
          this.hasCheckQrcode = this.taskInfo.checkin_scan_code !== 1
        } else {
          this.$toast(res.msg)
        }
      })
    },
    // 当前设备下标
    taskNowInd (arr) {
      arr = arr || []
      let ind = arr.length - 1
      const ids = arr.map(ite => ite.id)

      if (this.point_id) {
        return ids.indexOf(+this.point_id)
      } else {
        this.point_id = arr[arr.length - 1].id
        for (let i = 0; i < arr.length; i++) {
          if (!arr[i].commit_id) {
            this.point_id = arr[i].id
            ind = i
            break
          }
        }

        return ind
      }
    },
    // 图片上传状态
    uploading (flag) {
      if (flag) {
        this.pageLoading = true
      } else {
        setTimeout(() => {
          this.pageLoading = false
        }, 2000)
      }
    },
    // 图片上传
    changeFiles (list) {
      if (list[0] && list[0].url) {
        this.goEdit({ image: list[0].orgUrl })
      }
    },
    // 扫码成功
    scanSuccess () {
      this.$toast('扫码签到成功')
      this.hasCheckQrcode = true
      // 如果未开启拍照签到，则直接跳转
      if (!this.taskInfo.checkin_photo) {
        this.goEdit()
      }
    },
    // 检查项plan/editClean
    goEdit (params = {}) {
      this.$router.replace({
        name: 'CleanPlanEdit',
        query: {
          ...params,
          id: this.taskId || this.taskInfo.id,
          point_id: +this.point_id
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .facility {
    background: #F6F8FA;
    ::v-deep .facility-button {
      .van-uploader {
        width: 100%;
      }
      .van-uploader__input-wrapper {
        width: 100%;
      }
    }

    &-header {
      background: #fff;
      padding: 10px 16px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    &-flex {
      display: flex;
      align-items: center;
    }

    &-back, &-now, &-total {
      font-size: 15px;
      color: #333;
      line-height: 22px;
      font-weight: 400;
    }

    &-now {
      color: #6A98FF;
    }

    &-total {
      color: #999999;
    }

    &-content {
      min-height: calc(100vh - 126px);
      background: #fff;
      margin: 4px 0;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      position: relative;
    }

    &-name {
      font-size: 18px;
      color: #333;
      line-height: 25px;
      font-weight: 400;
      margin-bottom: 8px;
      position: absolute;
      top: 16px;
    }

    &-location {
      margin-bottom: 24px;
    }

    &-text, &-light {
      font-size: 14px;
      color: #999;
      line-height: 20px;
      font-weight: 400;
    }

    &-light {
      color: #E1AA6C;
    }

    &-image {
      width: 250px;
    }

    &-tips {
      margin-top: 26px;
    }

    &-button {
      padding: 16px 37px;
      box-sizing: border-box;
      background: #fff;
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
    }
  }

  ::v-deep {
    .van-uploader, .van-uploader__input-wrapper {
      width: 100%;
    }
    .van-uploader__preview {
      width: 100% !important;
      height: 40px !important;
      .van-uploader__mask, img, .van-uploader__preview-delete {
        display: none;
      }
    }
  }
</style>
