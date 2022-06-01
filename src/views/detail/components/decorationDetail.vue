<template>
  <!--环境工单详情-->
  <div class="work-detail">
    <div class="work-detail-content">
      <div class="work-between work-mgb20">
        <span class="work-detail-title">基本信息</span>
        <div class="work-detail-urgent-content">
          <!--加急-->
          <van-button v-if="flowInstance.is_urgent && flowInstance.is_urgent === 1" class="work-detail-urgent" size="mini" type="info">
            <template slot="default">
              <svg-icon class="work-detail-urgent-icon" icon-class="notice-urgent" />
              <span>加急</span>
            </template>
          </van-button>
          <!--状态-->
          <span class="work-detail-status">
            {{ getStatus(flowInstance) }}
          </span>
        </div>
      </div>
      <!--时间-->
      <p class="work-detail-row">
        <span class="work-detail-desc">
          {{ timeHandle(flowInstance['created']) }}
        </span>
      </p>
      <!--项目名称-->
      <p class="work-detail-row">
        <span class="work-detail-label">项目名称：</span>
        <span class="work-detail-desc">
          {{ flowInstance.group_name }}
        </span>
      </p>
      <!--计划来源-->
      <p class="work-detail-row">
        <span class="work-detail-label">计划来源：</span>
        <span class="work-detail-desc">
          {{ flowInstance.source | instanceSource }}
        </span>
      </p>
      <!--计划名称-->
      <p class="work-detail-row">
        <span class="work-detail-label">计划名称：</span>
        <span class="work-detail-desc">
          {{ taskInfo.plan_name }}
        </span>
      </p>
      <!--服务名称-->
      <p class="work-detail-row">
        <span class="work-detail-label">服务名称：</span>
        <span class="work-detail-desc">
          {{ flowInstance['biz_service_name'] }}/{{ flowInstance['biz_subservice_name'] }}
        </span>
      </p>
      <!--计划周期-->
      <div class="work-detail-row" style="align-items:flex-start">
        <span class="work-detail-label">计划周期：</span>
        <span class="work-detail-desc">
          <div v-if="taskInfo.cycle===1" style="word-break: break-all;">
            <span>每天：{{ getTimings(taskInfo.timings) }}</span>
          </div>
          <div v-if="taskInfo.cycle===2" style="word-break: break-all;">
            <span style="margin-right: 8px;">每周：{{ getWeekDays(taskInfo.days) }}</span>
            <span>{{ getTimings(taskInfo.timings) }}</span>
          </div>
          <div v-if="taskInfo.cycle===3" style="word-break: break-all;">
            <span style="margin-right: 8px;">每月：{{ getMonthDays(taskInfo.days) }}</span>
            <span>{{ getTimings(taskInfo.timings) }}</span>
          </div>
          <div v-if="taskInfo.skip_restday===1" style="color: #CDCDCD;font-size: 14px;">自动跳过休息日（人事规定的假期）</div>
        </span>
      </div>
      <!--提单人-->
      <p v-if="launcherType==='C' && workDetail.launcher" class="work-detail-row">
        <span class="work-detail-label">提单人：</span>
        <span class="work-detail-desc">
          {{ flowInstance.launcher_name }}
        </span>
        <span class="work-detail-yellow" @click="$refs.df.handleDial([{name:workDetail.launcher.user.user_mobile}])">
          {{ workDetail.launcher.user.user_mobile }}
        </span>
      </p>
      <!--提单人-->
      <template v-if="launcherType==='B' && workDetail.launcher">
        <p class="work-detail-row">
          <span class="work-detail-label">提单人：</span>
          <span class="work-detail-desc">
            {{ flowInstance.launcher_name }}
          </span>
          <span class="work-detail-yellow" @click="$refs.df.handleDial([{name:workDetail.launcher.staff.mobile}])">
            {{ workDetail.launcher.staff.mobile }}
          </span>
        </p>
      </template>
    </div>

    <!--工单信息-->
    <div class="work-detail-content">
      <!--工单编号-->
      <p class="work-detail-row">
        <span class="work-detail-label">工单编号：</span>
        <span class="work-detail-desc">
          {{ flowInstance.no }}
        </span>
      </p>
    </div>

    <!--详细信息-->
    <div class="work-detail-content" style="padding-bottom: 65px;">
      <div class="work-between work-mgb8">
        <span class="work-detail-title">详细信息</span>
        <div class="work-detail-urgent-content">
          <span class="work-detail-status" style="color: #D0D0D0;">
            点击底部的处理按钮开始执行任务
          </span>
        </div>
      </div>
      <!--环境分组-->
      <!-- <p v-if="groupInfo" class="work-detail-row">
        <span class="work-detail-label">环境分组：{{ groupInfo.name }}</span>
      </p> -->
      <!--设备信息-->
      <ul class="tack-content">
        <li v-for="(item, index) in taskInfo.task_patrol" :key="index" class="track-item">
          <div class="detail">
            <!--待处理-->
            <template v-if="!item.commit_id">
              <van-cell :title="item.room_name">
                <template #icon>
                  <span class="steps">{{ index+1 }}</span>
                </template>
                <a v-if="showDeal" @click="toComplate(item, index)">处理</a>
              </van-cell>
            </template>

            <!--正常-->
            <template v-if="item.commit_id && item.is_right">
              <van-cell class="done" :title="item.room_name" is-link>
                <template #icon>
                  <svg-icon icon-class="checked-blue"></svg-icon>
                </template>
                <span @click="showListDetails(item)">合格</span>
              </van-cell>
            </template>

            <!--异常-->
            <template v-if="item.commit_id&&!item.is_right">
              <van-cell class="done" is-link>
                <template #title>
                  <span @click="showListDetails(item)">{{ item.room_name }}</span>
                </template>
                <template #icon>
                  <svg-icon icon-class="checked-blue"></svg-icon>
                </template>
                <span class="error" style="color: #F7B500;" @click="showListDetails(item)">不合格</span>
              </van-cell>
            </template>
          </div>
        </li>
      </ul>
    </div>

    <!--拨打电话-->
    <dial-phone ref="df" />
  </div>
</template>

<script>
import dialPhone from '@/views/components/dialPhone'
import { getItemByValue } from '@/utils/index'
import { patrolTaskInfo } from '@/api/task'
import { WorkOrderSource, WorkOrderType } from '@/utils/const'

export default {
  name: 'BasicDetail',
  components: {
    dialPhone
  },
  props: {
    orderId: {
      type: String,
      default: ''
    },
    flowInstance: {
      type: Object,
      default: () => {}
    },
    workDetail: {
      type: Object,
      default: () => {}
    },
    tdNode: {
      type: Object,
      default: () => {}
    },
    nowTime: {
      type: String,
      default: () => ''
    }
  },
  data () {
    return {
      groupInfo: {},
      taskInfo: {}
    }
  },
  watch: {
    'orderId': {
      handler (val) {
        val && this.getTaskDetail()
      },
      immediate: true
    }
  },
  computed: {
    // 录单类型
    launcherType () {
      if (this.workDetail && this.workDetail.launcher) {
        return this.workDetail.launcher.launcher_type
      }

      return ''
    },
    // 是否显示"处理"按钮
    showDeal () {
      console.log('是否显示"处理"按钮', this.workDetail)
      return this.workDetail.is_my_todo && !this.workDetail.need_grab && this.workDetail.status === 1
    }
  },
  methods: {
    // 右上角状态显示
    getStatus (item) {
      // 处理中、挂起中展示节点名称，其他的展示状态
      if ([1, 2].indexOf(item.status) > -1) {
        return this.tdNode['biz_node_name'] || ''
      }

      return getItemByValue(this.appConfig ? this.appConfig.WFE_FLOW_INSTANCE_STATUS : [], item.status) || ''
    },

    // 来源
    getSource (source) {
      return getItemByValue(this.appConfig.WFE_FLOW_INSTANCE_SOURCE, source) || '无'
    },

    /**
       * 计划任务里，获取周一、周二等
       * @param days '1,2,3'
       * @returns {string|*}
       */
    getWeekDays (days) {
      const map = {
        1: '一',
        2: '二',
        3: '三',
        4: '四',
        5: '五',
        6: '六',
        7: '日'
      }
      if (!days) {
        return [].join('、')
      } else {
        return days.split(',').sort().map(item => '周' + map[item]).join('、')
      }
    },

    /**
       * 计划任务里，获取一个月的几号
       * @param days '1,2,3'
       * @returns {*[]|*}
       */
    getMonthDays (days) {
      if (!days) {
        return []
      }
      return days.split(',').sort().map(item => item + '号').join('、')
    },

    /**
       * 计划任务里，时间展示的获取形式
       * @param timings
       * @returns {string|*}
       */
    getTimings (timings) {
      if (!timings) {
        return [].join(',')
      } else {
        return timings.split(',').join(',')
      }
    },

    // 获取设备任务详情
    getTaskDetail () {
      patrolTaskInfo({
        work_order_record_id: this.orderId
      }).then(res => {
        if (res.code === 200) {
          this.taskInfo = res.data || {}
          this.groupInfo = this.taskInfo['cleaning_group'] || {}
          return
        }
        this.$toast('获取任务详情失败')
      })
    },

    // 去处理
    toComplate (item, index, oId) {
      // 装修工单没有点位，直接判断是否签单，是->扫码签到，否->不签到跳转到填写表单页面
      if (this.taskInfo.enable_checkin) {
        this.$router.push({ name: 'PlanFacilityDecoration', query: { order_id: this.orderId } })
      } else {
        this.$router.replace({ name: 'DecorationPlanEdit', query: { id: this.orderId } })
      }
    },

    // 展示详情
    showListDetails (item) {
      this.$router.push({
        name: 'DecorationPlanResult',
        query: { id: item.commit_id, taskId: this.taskInfo.id }
      })
    },

    // 去提单
    toReport (item) {
      const source = WorkOrderSource.cleanTask
      this.$router.push({
        name: 'WorkBrokenReport',
        query: {
          source: source, commitId: item.commit_id, pointId: item.id, taskId: this.taskInfo.id, type: WorkOrderType.clean, groupId: this.flowInstance.group_id
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .work {
    font-family: PingFangSC-Regular, PingFang SC;
    height: 100%;
    background: #F6F8FA;

    .flex-column.van-tab__pane {
      height: calc(100vh - 44px);
      overflow-y: auto;
    }

    &-between {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    &-mgb20 {
      margin-bottom: 20px;
    }

    &-mgb8 {
      margin-bottom: 8px;
    }

    &-mgb16 {
      margin-bottom: 16px;
    }

    &-detail {
      overflow: scroll;
      margin-bottom: 4px;

      &-content {
        padding: 12px 16px;
        box-sizing: border-box;
        background: #fff;
        margin-top: 4px;
      }

      &-title {
        font-size: 15px;
        color: #282828;
        line-height: 22px;
        font-weight: 500;
      }

      &-label, &-status, &-desc, &-yellow {
        font-size: 14px;
        color: #666;
        line-height: 20px;
        font-weight: 400;
      }

      &-status {
        color: #999;
        margin-left: 12px;
      }

      &-label {
        min-width: 70px;
      }

      &-yellow {
        color: #BC8D58;
        margin-left: 8px;
      }

      &-row {
        display: flex;
        align-items: center;
        margin-bottom: 8px;

        &:last-child {
          margin-bottom: 0;
        }
      }

      &-pictures {
        display: flex;
        flex-wrap: wrap;
      }

      &-image {
        margin-right: 7px;
        background: #f00;
        border-radius: 2px;

        &:nth-child(4n) {
          margin-right: 0;
        }
      }

      &-action {
        padding: 0 16px;
        box-sizing: border-box;
        background: #fff;
        border-top: 1px solid #F6F8FA;
      }

      &-urgent {
        width: 55px;
        color: #FA5151;
        background: #FEE5E5;
        border-radius: 4px;
        font-size: 12px;
        border: 0;

        &-content {
          display: flex;
          align-items: center;
        }
      }

      &-disabled {
        align-items: flex-start;

        &-content {
          flex: 1;
          display: flex;
          flex-wrap: wrap;
        }
      }
    }

    &-flexstart {
      align-items: flex-start;
    }
  }

  .tack-content {
    .track-item {
      /*background: #f6f8fa80;*/
      background: #FAFBFD;
      margin-bottom: 4px;
    }

    ::v-deep .van-cell {
      background: transparent;
      padding: 12px 12px 12px 12px;
      font-size: 14px;
      font-weight: 400;
      color: #666666;
      line-height: 24px;
      align-items: center;
      &::before {
        width: 2px;
        /*background: #d0d0d099;*/
        background: #E3E3E3;
        content: "";
        position: absolute;
        left: 0;
        height: 100%;
        // margin-top: -12px;
        // margin-bottom: -12px;
      }
      &.done {
        padding-right: 5px;
      }
      &.done::before {
        background: #e1aa6c;
      }
      .van-cell__value {
        width: 85px;
        min-width: 85px;
        flex: unset;
        a {
          color: #6A98FF;
        }
        .error {
          color: #FA5151;
        }
      }
      svg.svg-icon {
        color: #6A98FF;
        height: 17px;
        width: 17px;
        padding: 0 10px 0 0;
      }
      span.steps {
        font-size: 12px;
        font-family: PingFangSC-Heavy, PingFang SC;
        font-weight: 800;
        color: #FFFFFF;
        line-height: 17px;
        width: 17px;
        height: 17px;
        /*background: #d0d0d099;*/
        background: #E3E3E3;
        border-radius: 50%;
        text-align: center;
        margin: 3px 10px 0 0;
      }
    }
  }
</style>
