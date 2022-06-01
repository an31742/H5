<template>
  <div class="plan-result result">
    <!-- 环境、秩序管理 -->
    <div class="result-content">
      <p class="result-text result-mgb8">工作模板：{{ taskItemInfo.name }}</p>
      <p class="result-gray result-mgb8">{{ taskItemInfo.description }}</p>
      <p v-if="taskInfo.enable_checkin" class="result-green">签到情况：签到成功</p>
      <p v-if="checkinImage" class="result-gray result-mgb8">
        <van-uploader v-model="checkinImage" :deletable="false" class="result-upload"></van-uploader>
      </p>
    </div>
    <!-- 表单结果 -->
    <form-result :answers.sync="answers" projectType="作业名称"></form-result>

    <!--底部按钮-->
    <div class="result-button">
      <!--点位异常，去提单-->
      <template v-if="commitDetail.is_right===0 && !commitDetail.repair_log_id">
        <span class="result-button-cancel">点位异常</span>
        <van-button
          style="width:200px;font-size:18px;height:40px;"
          round
          block
          type="primary"
          native-type="submit"
          color="linear-gradient(176deg, #F2D5A5 0%, #E1AA6C 100%)"
          @click="toReport"
        >提单
        </van-button>
      </template>

      <!--点位异常，已提单-->
      <template v-if="commitDetail.is_right===0 && commitDetail.repair_log_id">
        <span class="result-button-error">点位异常，已提单</span>
      </template>

      <!--点位正常-->
      <template v-if="commitDetail.is_right===1">
        <span class="result-button-normal">点位正常</span>
      </template>
    </div>
  </div>
</template>

<script>
import formResult from '../components/formResult.vue'
import { minipGuardianCheckListCommitGet } from '@/api/task'
import { string2obj } from '@/utils/index'
import { WorkOrderSource, WorkOrderType } from '@/utils/const'

export default {
  name: 'SquencePlanResult',
  components: {
    formResult
  },
  data () {
    return {
      taskItemInfo: {},
      taskInfo: {},
      answers: [],
      pointId: '',
      commitDetail: {},
      commitId: this.$route.query.id || '',
      taskId: this.$route.query.taskId || '',
      checkinImage: ''
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
      minipGuardianCheckListCommitGet({
        id: this.commitId
      }).then(res => {
        if (res.code === 200) {
          this.commitDetail = res.data || {}
          let point = this.commitDetail.location_point || {}
          point = point.point || {}
          this.pointId = point.id || ''
          if (res.data.checkin_images) {
            this.checkinImage = [
              {
                url: res.data.checkin_images
              }
            ]
          }
          this.taskItemInfo = point.template || {}
          this.taskInfo = this.commitDetail.task || {}
          this.answers = this.dealData(this.commitDetail.answers || [])
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
      const source = WorkOrderSource.squenceTask
      this.$router.push({
        name: 'WorkBrokenReport',
        query: {
          source: source, commitId: this.commitId, pointId: this.pointId, taskId: this.taskId, type: WorkOrderType.squence, groupId: this.commitDetail.belong_group_id
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

    &-gray {
      font-size: 14px;
      color: #999999;
      line-height: 23px;
      margin-top: 8px;
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
      margin-top: 8px;
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
        line-height: 40px;
      }
      &-error {
        color: #999999;
        text-align: center;
        width: 100%;
        line-height: 40px;
      }
    }
  }
</style>
