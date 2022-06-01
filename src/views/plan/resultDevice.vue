<template>
  <div class="plan-result result">
    <!-- 工程管理 -->
    <div class="result-content">
      <p class="result-text result-mgb8">设备编号：{{ device.code }}</p>
      <p class="result-text result-mgb8">设备名称：{{ device.name }}</p>
      <p class="result-text result-mgb8">设备位置：{{ device.location_name }}</p>
      <p
        v-if="taskInfo.enable_checkin && device.qrcode_broken && device.qrcode_broken===1"
        class="result-red"
        style="margin-top: 0.213rem;"
      >签到情况：二维码损毁，已提单</p>
      <p
        v-if="taskInfo.enable_checkin && device.qrcode_broken === 0"
        class="result-text"
        style="color: #64CCA8;margin-top: 0.213rem;"
      >签到情况：签到成功</p>
      <p v-if="checkinImage" class="result-gray result-mgb8">
        <van-uploader v-model="checkinImage" :deletable="false" class="result-upload"></van-uploader>
      </p>
    </div>
    <!-- 表单结果 -->
    <form-result :answers.sync="answers" :projectType="projectType"></form-result>

    <!--底部按钮-->
    <div class="result-button">
      <!--设备异常，去提单-->
      <template v-if="commitDetail.is_right===0 && !commitDetail.repair_log_id">
        <span class="result-button-cancel">设备异常</span>
        <van-button
          class="report-btn"
          round
          block
          type="primary"
          native-type="submit"
          color="linear-gradient(176deg, #F2D5A5 0%, #E1AA6C 100%)"
          @click="toReport"
        >提单
        </van-button>
      </template>

      <!--设备异常，已提单-->
      <template v-if="commitDetail.is_right===0 && commitDetail.repair_log_id">
        <span class="result-button-error">设备异常，已提单</span>
      </template>

      <!--设备正常-->
      <template v-if="commitDetail.is_right===1">
        <span class="result-button-normal">设备正常</span>
      </template>
    </div>
  </div>
</template>

<script>
import formResult from '../components/formResult.vue'
import { minipDeviceCheckListCommitGet } from '@/api/task'
import { string2obj, getItemByValue } from '@/utils/index'
import { WorkOrderSource, WorkOrderType } from '@/utils/const'

export default {
  name: 'DevicePlanResult',
  components: {
    formResult
  },
  data () {
    return {
      device: {},
      answers: [],
      taskInfo: {},
      commitDetail: {},
      taskId: this.$route.query.taskId || '',
      commitId: this.$route.query.id || '',
      project: this.$route.query.project || 1,
      checkinImage: ''
    }
  },
  computed: {
    projectType () {
      return getItemByValue(this.appConfig.DEVICE_PROJECT_LIST, +this.project)
    }
  },
  created () {
    if (!this.commitId) {
      this.$toast('参数错误')
      return
    }

    this.getCommitDetail()
  },
  methods: {
    // 获取提交记录
    getCommitDetail () {
      minipDeviceCheckListCommitGet({
        id: this.commitId
      }).then(res => {
        if (res.code === 200) {
          this.commitDetail = res.data || {}
          this.taskInfo = this.commitDetail.task || {}
          this.device = this.commitDetail.device || {}
          this.answers = this.dealData(this.commitDetail.answers || [])
          if (res.data.checkin_images) {
            this.checkinImage = [
              {
                url: res.data.checkin_images
              }
            ]
          }
        } else {
          this.$toast(res.msg || '获取信息失败')
        }
      })
    },

    // 处理数据
    dealData (arr) {
      return arr.map(item => {
        if (item.type === 6) {
          item.answer = this.formatPictures(item.answer)
        }
        if (item.type === 5) {
          item.answer = string2obj(item.answer)
        }
        return item
      })
    },

    // 图片格式
    formatPictures (str) {
      str = string2obj(str) || []

      return str.map(item => {
        return {
          url: item,
          status: 'done'
        }
      })
    },

    // 去提单
    toReport () {
      // 任务类型 1-巡检 2-保养
      const source = +this.project === 1 ? WorkOrderSource.deviceCheck : WorkOrderSource.deviceProvide
      this.$router.push({
        name: 'WorkBrokenReport',
        query: {
          source: source, commitId: this.commitId, deviceId: this.device.id, taskId: this.taskId, type: WorkOrderType.device, groupId: this.commitDetail.belong_group_id
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .result {
    font-family: PingFangSC-Regular, PingFang SC;

    &-content {
      background: #fff;
      padding: 12px 16px;
      box-sizing: border-box;
      margin-bottom: 8px;
    }

    &-text, &-red {
      font-size: 15px;
      color: #282828;
      line-height: 21px;
      font-weight: 400;
    }

    &-red {
      color: #FA5151;
    }

    &-green {
      font-size: 14px;
      color: #333333;
      line-height: 20px;
      font-weight: 400;
      color: #64CCA8;
    }

    &-button {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 36px;
      box-sizing: border-box;
      background: #fff;
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;

      &-cancel {
        font-size: 16px;
        color: #FA5151;
        line-height: 24px;
        padding: 0 4px;
        box-sizing: border-box;
      }
      &-normal {
        color: #64CCA8;
        text-align: center;
        width: 100%;
      }
      &-error {
        color: #999999;
        text-align: center;
        width: 100%;
      }
    }
  }
  .report-btn {
    width:200px;font-size:18px;height:40px;
  }
</style>
