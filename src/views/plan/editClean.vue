<template>
  <div class="edit">
    <!--点位信息-->
    <div class="edit-content">
      <p class="edit-between">
        <span class="edit-desc">点位{{ currentPointIndex + 1 }}：{{ pointList[currentPointIndex] && pointList[currentPointIndex].name || '' }}</span>
        <span class="edit-text">{{ currentPointIndex + 1 }} / {{ pointList.length }}</span>
      </p>
      <p v-if="taskInfo.enable_checkin" class="edit-sign" style="color: #64CCA8;font-size: 0.4rem;margin-top: 0.213rem;">签到情况：签到成功</p>
      <p v-if="checkInImage" class="plan-result">
        <van-uploader v-model="checkInImage" :deletable="false" class="result-upload"></van-uploader>
      </p>
    </div>

    <!--表单-->
    <form-edit ref="fe" :questions="questions" projectType="作业名称" @onSubmit="handleSubmit">
      <template #button>
        <!--底部按钮-->
        <div class="edit-button">
          <span class="edit-button-cancel" @click="$router.back()">取消</span>
          <span
            class="edit-button-change"
            @click="rectification"
          >
            发起整改
          </span>
          <van-button
            round
            block
            class="confirm"
            type="primary"
            native-type="submit"
            color="linear-gradient(176deg, #F2D5A5 0%, #E1AA6C 100%)"
          >
            {{ nextText }}
          </van-button>
        </div>
      </template>
    </form-edit>

  </div>
</template>

<script>
import formEdit from '../components/formEdit.vue'
import { WorkOrderSource, WorkOrderType } from '@/utils/const'
import { minipCleaningCheckListGet, minipCleaningCheckListCommit, minipCleaningTaskInfo } from '@/api/task'

export default {
  name: 'CleanPlanEdit',
  components: {
    formEdit
  },
  data () {
    return {
      questions: [],
      taskInfo: {},
      pointList: [],
      nextIndex: -1,
      currentPointIndex: -1,
      taskId: this.$route.query.id || '',
      pointId: this.$route.query.point_id || '',
      image_url: this.$route.query.image || '',
      checkInImage: this.$route.query.image ? [{ url: this.$route.query.image }] : ''
    }
  },
  computed: {
    // 下一步的文案
    nextText () {
      return this.nextIndex === -1 ? '完成' : '提交并进行下一个'
    }
  },
  created () {
    if (!this.taskId || !this.pointId) {
      this.$toast('参数错误')
      return
    }
    this.getTaskInfo()
  },
  methods: {
    // 获取任务详情
    getTaskInfo () {
      minipCleaningTaskInfo({
        id: this.taskId
      }).then(res => {
        if (res.code === 200) {
          this.taskInfo = res.data || {}
          const gp = this.taskInfo['cleaning_group'] || {}
          this.pointList = gp.location_points || []
          this.getCheckList()

          // 循环找出currentIndex和nextIndex
          for (let i = 0; i < this.pointList.length; i++) {
            if (this.nextIndex === -1 &&
                this.currentPointIndex !== -1 &&
                !this.pointList[i]['commit_id']) {
              this.nextIndex = i
            }
            if (this.pointList[i].id === +this.pointId) {
              this.currentPointIndex = i
            }
          }
        } else {
          this.$toast(res.msg || '获取信息失败')
        }
      })
    },

    // 获取检查项
    getCheckList () {
      minipCleaningCheckListGet({
        id: this.pointId
      }).then(res => {
        if (res.code === 200) {
          this.questions = res.data ? this.formDataHandle(res.data) : []
        } else {
          this.$toast(res.msg || '获取信息失败')
        }
      })
    },

    // 表单数据初始化
    formDataHandle (data) {
      data.map(item => {
        if ([5, 6].includes(item.type)) {
          item.answer = []
        } else {
          item.answer = ''
        }
      })
      return data
    },

    // 提交表单
    handleSubmit () {
      const data = {
        task_id: +this.taskId,
        location_point_id: +this.pointId,
        checklist: this.$refs.fe.getCheckList(),
        checkin_images: this.image_url || ''
      }

      minipCleaningCheckListCommit(data).then(res => {
        if (res.code === 200) {
          if (this.nextIndex !== -1) {
            this.$toast('提交成功')
          } else {
            this.$toast('任务完成')
          }

          const fun = () => {
            if (this.nextIndex !== -1) {
              this.$router.replace({
                name: 'PlanFacilityClean',
                query: {
                  id: this.taskId,
                  point_id: this.pointList[this.nextIndex].id
                }
              })
            } else {
              this.$router.back()
            }
          }

          // 发现异常情况
          if (!res.data.is_right) {
            this.$confirm({
              title: '提示',
              message: '发现异常情况，是否提交故障工单？',
              confirmButtonText: '立即提交',
              cancelButtonText: '稍后处理',
              confirmButtonColor: '#BC8D58'
            }).then(() => {
              // 任务类型
              const source = WorkOrderSource.cleanTask
              this.$router.replace({
                name: 'WorkBrokenReport',
                query: {
                  source: source, commitId: res.data.id, pointId: this.pointId, taskId: this.taskId, type: WorkOrderType.clean, nextIndex: this.nextIndex, groupId: this.taskInfo.belong_group_id
                }
              })
            }).catch(() => {
              fun()
            })
          } else {
            fun()
          }
        } else {
          this.$toast(res.msg || '提交失败')
        }
      }).catch(_ => {})
    },

    // 发起整改
    rectification () {
      const source = WorkOrderSource.cleanTask
      this.$router.replace({
        name: 'WorkBrokenReport',
        query: {
          source: source, pointId: this.pointId, taskId: this.taskId, type: WorkOrderType.clean, nextIndex: this.nextIndex, groupId: this.taskInfo.belong_group_id
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .edit {
    font-family: PingFangSC-Regular, PingFang SC;
    background: #F6F8FA;
    height: 100%;
    overflow: auto;

    &-content {
      background: #fff;
      padding: 10px 16px;
      box-sizing: border-box;
      margin-bottom: 8px;
    }

    &-between {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    &-desc, &-text {
      font-size: 15px;
      color: #282828;
      line-height: 20px;
      font-weight: 400;
    }

    &-desc {
      flex: 1;
    }

    &-text {
      color: #999;
    }

    &-button {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 12px;
      box-sizing: border-box;
      background: #fff;
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      padding-bottom: calc(constant(safe-area-inset-bottom) + 16px); //兼容IOS < 11.2
      padding-bottom: calc(env(safe-area-inset-bottom) + 16px);//兼容IOS > 11.2
      &-cancel {
        font-size: 16px;
        color: #999;
        line-height: 24px;
        padding: 0 8px;
        box-sizing: border-box;
      }
    }

    .confirm {
      width:200px;
      font-size:16px;
      height:40px;
      border-radius: 6px;
    }

    .edit-button-change{
      width:80px;
      font-size:16px;
      height:40px;
      border-radius: 6px;
      color: #E1AA6C;
      display: inline-block;
      text-align: center;
      line-height: 40px;
      border: 1px solid #E1AA6C;
      box-sizing: border-box;
    }
  }
</style>
