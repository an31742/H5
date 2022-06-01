<template>
  <!-- 秩序的拍照签到和扫码签到 -->
  <div class="facility">
    <div class="facility-header">
      <p class="facility-back facility-flex">
        <svg-icon icon-class="arrow-left-back" style="font-size:14px;"></svg-icon>
        <span @click="$router.back()">返回</span>
      </p>
      <p><span class="facility-now">{{ facilityNow + 1 }}</span><span class="facility-total">/{{ facilityTotal }}</span></p>
    </div>
    <div class="facility-content">
      <p class="facility-name">{{ facilityName }}</p>
      <!-- 模拟设备占位 -->
      <div class="facility-image">
        <img :src="require('@/assets/image/default_sequence.png')" />
      </div>
    </div>
    <div class="facility-button">

      <!--未开启签到-->
      <van-button
        v-if="!taskInfo.enable_checkin"
        style="font-size:18px;height:40px;"
        round
        block
        type="primary"
        color="linear-gradient(176deg, #F2D5A5 0%, #E1AA6C 100%)"
        @click="goEdit"
      >
        处理
      </van-button>
      <!--开启签到-->
      <template v-else>
        <!--拍照签到-->
        <upload
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
              ref="aaa"
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
      </template>
    </div>

    <van-overlay :show="pageLoading">
      <div class="wrapper">
        <van-loading/>
      </div>
    </van-overlay>
  </div>
</template>

<script>
import { patrolTaskInfo } from '@/api/task'
import upload from '@/views/components/upload_form'

export default {
  name: 'PlanFacilitySequence',
  components: {
    upload
  },
  data () {
    return {
      recordId: '',
      facilityName: '',
      taskInfo: {},
      facilityNow: 0, // 当前设备
      facilityTotal: 0, // 设备总数
      hasCheckQrcode: false, // 是否已经扫码签到
      pageLoading: false,
      facilityQrCode: '',

      order_id: this.$route.query.order_id
    }
  },
  mounted () {
    console.log('asffsdf', this.$route.query)
    this.recordId = this.$route.query.order_id || ''
    this.init()
  },
  methods: {
    // 初始化
    init () {
      this.loadding = true
      // 任务详情
      const params = {
        work_order_record_id: this.order_id
      }

      patrolTaskInfo(params).then(res => {
        if (res.code === 200) {
          this.taskInfo = res.data || {}
          console.log(this.taskInfo)
          this.facilityName = this.taskInfo.task_patrol[0].room_name
        } else {
          this.$toast(res.msg)
        }
      })
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
    // 检查项
    goEdit (params = {}) {
      console.log(this.recordId)
      this.$router.replace({
        name: 'DecorationPlanEdit',
        query: {
          ...params,
          id: this.recordId
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
