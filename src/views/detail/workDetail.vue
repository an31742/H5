<template>
  <!-- 工单详情 -->
  <div class="work">
    <van-tabs v-model="active" class="work-tabs" :border="false" color="#E1AA6C">
      <!-- 详情 -->
      <van-tab title="详情" class="">
        <template>
          <div class="expand">
            <!--详细信息-->
            <!--工程计划工单详情-->
            <deviceDetail
              v-if="DeviceWorkTypes.includes(flowInstance.source)"
              ref="dd"
              :flowInstance="flowInstance"
              :formData="formData"
              :workDetail.sync="workDetail"
              :tdNode="tdNode"
              :nowTime="nowTime"
              :orderId="orderId"
            ></deviceDetail>

            <!--环境工单详情-->
            <decorationDetail
              v-else-if="DecorationTypes.includes(flowInstance.source)"
              ref="ded"
              :flowInstance="flowInstance"
              :formData="formData"
              :workDetail.sync="workDetail"
              :tdNode="tdNode"
              :nowTime="nowTime"
              :orderId="orderId"
            ></decorationDetail>

            <!--环境工单详情-->
            <cleanDetail
              v-else-if="CleanWorkTypes.includes(flowInstance.source)"
              ref="cd"
              :flowInstance="flowInstance"
              :formData="formData"
              :workDetail.sync="workDetail"
              :tdNode="tdNode"
              :nowTime="nowTime"
              :orderId="orderId"
            ></cleanDetail>

            <!--秩序工单详情-->
            <sequenceDetail
              v-else-if="SequenceWorkTypes.includes(flowInstance.source)"
              ref="sd"
              :flowInstance="flowInstance"
              :formData="formData"
              :workDetail.sync="workDetail"
              :tdNode="tdNode"
              :nowTime="nowTime"
              :orderId="orderId"
            ></sequenceDetail>

            <!--品质检查工单-->
            <qualityDetail
              v-else-if="QualityWorkTypes.includes(flowInstance.source)"
              ref="qd"
              :flowInstance="flowInstance"
              :todoNodeInstance="todoNodeInstance"
              :formData="formData"
              :workDetail.sync="workDetail"
              :tdNode="tdNode"
              :nowTime="nowTime"
              :orderId="orderId"
            ></qualityDetail>

            <!--一般工单详情-->
            <basicDetail
              v-else
              :flowInstance="flowInstance"
              :todoNodeInstance="todoNodeInstance"
              :formData="formData"
              :workDetail.sync="workDetail"
              :tdNode="tdNode"
              :nowTime="nowTime"
              :orderId="orderId"
              @changeZIndex="changeZIndex"
            ></basicDetail>

            <!--评价信息-->
            <div v-if="commitedFormData" class="appraise-info">
              <detail :formDate="commitedFormData" />
            </div>
          </div>

          <!--底部操作栏-->
          <div class="work-detail-action" :style="{'z-index': zIndex}">
            <work-action
              :order.sync="workDetail"
              fromType="mine"
              :isDownload="isDownload"
              @refresh="init"
              @deal="dealOrder(workDetail)"
              @result="result"
            ></work-action>
            <div v-if="workDetail._downloadStatus === 1" class="download-loading">
              <span style="color: #1A7AFF;font-size:14px;margin-right: 10px;">下载中</span><van-loading type="spinner" class="my-loading"></van-loading>
            </div>
          </div>
        </template>
      </van-tab>

      <!-- 进度 -->
      <van-tab title="进度">
        <locus></locus>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import { DeviceWorkTypes, SequenceWorkTypes, CleanWorkTypes, QualityWorkTypes, DecorationTypes } from '@/utils/const'
import workAction from '../work/components/workAction'
import detail from '@/views/formComponents/detail'
import basicDetail from './components/basicDetail'
import deviceDetail from './components/deviceDetail'
import sequenceDetail from './components/sequenceDetail'
import cleanDetail from './components/cleanDetail'
import decorationDetail from './components/decorationDetail'
import qualityDetail from './components/qualityDetail'
import { wfeFlowInstanceGet } from '@/api/wfe'
import locus from './components/locus'
import { minipDeviceTaskInfo, minipCleaningTaskInfo, minipGuardianTaskInfo, minipQualityTaskInfo } from '@/api/task'

import { string2obj } from '@/utils'

export default {
  name: 'WorkDetail',
  components: {
    sequenceDetail,
    deviceDetail,
    basicDetail,
    cleanDetail,
    decorationDetail,
    workAction,
    detail,
    locus,
    qualityDetail
  },
  data () {
    return {
      active: 0,
      formData: null,
      workDetail: {
        action: {}
      },
      tdNode: {},
      flowInstance: {},
      todoNodeInstance: {},
      doneInstances: [],

      orderId: this.$route.query.id || '',
      nowTime: '',

      // 设备工单
      DeviceWorkTypes,
      // 秩序工单
      SequenceWorkTypes,
      // 环境工单
      CleanWorkTypes,
      // 装修工单
      DecorationTypes,
      // 品质工单
      QualityWorkTypes,

      zIndex: 3000,
      isDownload: this.$route.query.download
    }
  },
  computed: {
    commitedFormData () { // 依据提交的评价表单
      const done = this.doneInstances.map(item => item['biz_node_code'] === 'NODE_CODE_COMMIT')

      const data = done && done[0] && done[0]['form_data'] ? done[0]['form_data'] : null

      return data ? string2obj(data) : null
    }
  },
  watch: {
    '$route.query.id' (val) {
      if (val && this.$route.name === 'WorkDetail') {
        this.orderId = val
        this.init()
      }
    }
  },
  deactivated () {
    this.active = 0
    this.formData = null
    this.workDetail = {
      action: {}
    }
    this.tdNode = {}
    this.flowInstance = {}
    this.todoNodeInstance = {}
    this.doneInstances = []
  },
  created () {
    if (!this.orderId) {
      this.$toast('参数错误')
      this.$router.back()
      return
    }
    this.init()
    this.isDownload = this.$route.query.download
    console.log(this.isDownload)
  },
  methods: {
    // 点击的下载的按钮的结果
    result (order) {
      console.log(order)
      this.workDetail._downloadText = order._downloadText
      this.workDetail._downloadStatus = order._downloadStatus
    },
    changeZIndex (zIndex) {
      this.zIndex = zIndex
    },
    string2obj,

    init () {
      this.getOrderDetail()
    },

    // 获取节点表单
    getOrderDetail () {
      wfeFlowInstanceGet({
        id: this.orderId
      }).then(res => {
        if (res.code === 200) {
          const dd = res.data || {}
          this.workDetail = dd
          this.nowTime = res.time

          this.tdNode = dd.todo_node_instance || {}
          this.flowInstance = this.workDetail['flow_instance'] || {}
          this.doneInstances = this.workDetail['done_node_instance'] || []
          this.todoNodeInstance = this.workDetail['todo_node_instance'] || {}

          // 打平数据结构，适配workAction里的数据结构
          this.workDetail.is_my_todo = this.tdNode.is_my_todo || false
          this.workDetail.allow_co = this.tdNode.allow_co || false
          this.workDetail.need_grab = this.tdNode.need_grab || false
          this.workDetail.allow_trans = this.tdNode.allow_trans || false
          this.workDetail.allow_hang = this.tdNode.allow_hang || false
          this.workDetail.todo_node_instance_id = this.tdNode.record_id || ''
          this.workDetail.record_id = this.flowInstance.record_id || ''
          this.workDetail.status = this.flowInstance.status || ''
          this.workDetail.source = this.flowInstance.source || ''
          this.workDetail.group_id = this.flowInstance.group_id || ''

          const firstNode = this.workDetail['first_node_instance']
          this.formData = firstNode['form_data'] ? string2obj(firstNode['form_data']) : null
          console.log(this.flowInstance.source, 'this.flowInstance.source')
          if (DeviceWorkTypes.includes(this.flowInstance.source)) {
            // this.workDetail.task_device = {}
            this.setDeviceGroup()
          }
          if (CleanWorkTypes.includes(this.flowInstance.source)) {
            this.setCleanGroup()
          }
          if (SequenceWorkTypes.includes(this.flowInstance.source)) {
            this.setSequenceGroup()
          }
          if (QualityWorkTypes.includes(this.flowInstance.source)) {
            this.setQualityGroup()
          }
          return
        }
        this.$toast('获取工单信息失败')
      })
    },
    setDeviceGroup () {
      minipDeviceTaskInfo({
        work_order_record_id: this.orderId
      }).then(res => {
        if (res.code === 200) {
          this.$set(this.workDetail, 'task_device', res.data || null)
          console.log(this.workDetail)
        }
      })
    },
    setCleanGroup () {
      minipCleaningTaskInfo({
        work_order_record_id: this.orderId
      }).then(res => {
        if (res.code === 200) {
          this.$set(this.workDetail, 'task_cleaning', res.data || null)
          console.log(this.workDetail)
        }
      })
    },
    setSequenceGroup () {
      minipGuardianTaskInfo({
        work_order_record_id: this.orderId
      }).then(res => {
        if (res.code === 200) {
          this.$set(this.workDetail, 'task_guardian', res.data || null)
          console.log(this.workDetail)
        }
      })
    },
    setQualityGroup () {
      minipQualityTaskInfo({
        work_order_record_id: this.orderId
      }).then(res => {
        if (res.code === 200) {
          this.$set(this.workDetail, 'task_quality', res.data || null)
          console.log(this.workDetail)
        }
      })
    },

    // 处理工单
    dealOrder (order) {
      // 工程工单
      if (this.DeviceWorkTypes.includes(this.flowInstance.source)) {
        this.$refs.dd.toComplate({}, null, order.todo_node_instance_id)
        return
      }

      // 环境工单
      if (this.CleanWorkTypes.includes(this.flowInstance.source)) {
        this.$refs.cd.toComplate({}, null, order.todo_node_instance_id)
        return
      }

      // 秩序工单
      if (this.SequenceWorkTypes.includes(this.flowInstance.source)) {
        this.$refs.sd.toComplate({}, null, order.todo_node_instance_id)
        return
      }

      // 裝修工單
      console.log(this.DecorationTypes.includes(this.flowInstance.source))
      if (this.DecorationTypes.includes(this.flowInstance.source)) {
        this.$refs.ded.toComplate({}, null, order.todo_node_instance_id)
        return
      }
      // 品质工单
      if (this.QualityWorkTypes.includes(this.flowInstance.source)) {
        this.$refs.qd.toComplate({}, null, order.todo_node_instance_id)
        return
      }

      // 普通工单
      this.$router.push({
        name: 'WorkDeal',
        query: { id: order.todo_node_instance_id },
        params: {
          flowInstance: this.flowInstance
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .download-loading{
    position: absolute;
    top: 0;
    left: 0;
    width: calc(100% - 40px);
    height: 100%;
    background: #fff;
    display: flex;
    justify-content: right;
    align-items: center;
    padding: 0 20px;
  }
  // ::v-deep .van-tabs__content{
  //   height: 100%;
  // }
  //  ::v-deep .van-tab__pane{
  //     height: 100vh;
  // }
  .work {
    font-family: PingFangSC-Regular, PingFang SC;
    height: 100%;
    background: #F6F8FA;
    .van-tabs{
      z-index: 1;
      height: 100%;
    }
    .expand {
      position: relative;
      height: 100%;
    }

    .work-detail-action {
      position: fixed;
      bottom: 0;
      bottom: 0;
      left: 0;
      width: 100%;
      padding-bottom:constant(safe-area-inset-bottom); //兼容IOS < 11.2
      padding-bottom:env(safe-area-inset-bottom);//兼容IOS > 11.2
      padding-left: 0 !important;
    }
    .flex-column.van-tab__pane {
      height: calc(100vh - 44px);
      height: calc(100vh - 44px - constant(safe-area-inset-bottom));
      height: calc(100vh - 44px - env(safe-area-inset-bottom));
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

  ::v-deep {
  .van-tab {
    border-bottom: none;
  }
}
</style>
