<template>
  <div>
    <!-- 有偿工单的金额 -->
    <div class="amount-content" v-if="order.cost_detail && order.cost_detail.amount">
      <div class="amount">总金额：<span style="color: #FF3B30;font-size:20px;">{{ centToYuan(order.cost_detail.amount) || '--' }}</span></div>
      <div class="amount-payment" v-if="order.cost_detail.pay_state && order.cost_detail.pay_state !== 1">实收金额：{{ centToYuan(order.cost_detail.actual_payment) || '--' }}</div>
    </div>
    <div v-if="showActions.length > 0 || showGrab || showDeal" class="operation">
      <div class="work-operation">
        <!--更多-->
        <span v-if="moreActions.length > 0" class="work-more" @click="showPicker = true">更多</span>
        <div class="work-action">
          <van-button
            v-for="(item, index) in showActions.slice(0, 3)"
            :key="index"
            type="default"
            round
            size="small"
            class="work-button"
            @click="item.fun()"
          >
            {{ item.name }}
          </van-button>

          <span v-if="showActions.length > 0 && (showGrab || showDeal)" class="work-line"></span>

          <!--抢单-->
          <van-button
            v-if="showGrab"
            type="primary"
            round
            size="small"
            class="deal"
            color="linear-gradient(45deg, #F2D5A5 0%, #E1AA6C 100%)"
            @click="grabOrder"
          >抢单
          </van-button>
          <!--处理-->
          <van-button
            v-else-if="showDeal"
            type="primary"
            round
            size="small"
            class="deal"
            color="linear-gradient(45deg, #F2D5A5 0%, #E1AA6C 100%)"
            @click="dealOrder"
          >处理
          </van-button>
        </div>
      </div>
      <!--更多弹层-->
      <van-action-sheet
        v-model="showPicker"
        :actions="moreActions"
        cancel-text="取消"
        close-on-click-action
        @cancel="showPicker=false"
        @select="selectAction"
      ></van-action-sheet>

      <!--追记弹层-->
      <van-popup v-model="recordShow" position="bottom">
        <p class="work-record">
          <span class="work-record-cancel" @click="recordShow=false">取消</span>
          <span class="work-record-title">追记</span>
          <span class="work-record-submit" @click="$refs.nf.submit()">提交</span>
        </p>
        <van-form ref="nf" validate-first :show-error-message="false" @submit="onSubmit">
          <van-field
            v-model="form.content"
            rows="4"
            type="textarea"
            show-word-limit
            maxlength="200"
            placeholder="请输入追记描述"
          ></van-field>

          <div class="field-space"></div>

          <FwUploadPhoto ref="upload" class="btn" :model="form" :opt="{code:'pictures', name: '上传照片'}"/>
        </van-form>
      </van-popup>

      <!--关单弹层-->
      <van-popup v-model="closeShow" position="bottom">
        <p class="work-record">
          <span class="work-record-cancel" @click="closeShow=false">取消</span>
          <span class="work-record-title">关单</span>
          <span class="work-record-submit" @click="$refs.cf.submit()">提交</span>
        </p>
        <van-form ref="cf" validate-first :show-error-message="false" @submit="onCloseSubmit">
          <van-field
            v-model="closeReason"
            rows="4"
            type="textarea"
            show-word-limit
            maxlength="200"
            placeholder="请输入关单意见，200字内"
          ></van-field>
        </van-form>
      </van-popup>

      <!--督办弹层-->
      <van-popup v-model="superviseShow" position="bottom">
        <p class="work-record">
          <span class="work-record-cancel" @click="superviseShow=false">取消</span>
          <span class="work-record-title">督办</span>
          <span class="work-record-submit" @click="$refs.ssf.submit()">提交</span>
        </p>
        <van-form ref="ssf" validate-first :show-error-message="false" @submit="onSuperviseSubmit">
          <van-field
            v-model="superviseReason"
            rows="4"
            type="textarea"
            show-word-limit
            maxlength="200"
            placeholder="请输入督办意见，200字内"
          ></van-field>
        </van-form>
      </van-popup>

      <!--协办弹层-->
      <van-popup v-model="assistShow" position="bottom" :style="{ height: '30%' }">
        <p class="work-record">
          <span class="work-record-cancel" @click="assistShow=false">取消</span>
          <span class="work-record-title">协办</span>
          <span class="work-record-submit" @click.stop="$refs.assistForm.submit()">提交</span>
        </p>
        <van-form ref="assistForm" validate-first :show-error-message="false" @submit="onAssistSubmit">
          <van-field
            clickable
            name="candidate_list"
            input-align="right"
            class="fw-field pr"
            label="选择协办人"
            placeholder="请选择"
          >
            <!--展示框-->
            <template #input>
              <input
                :value="candidateName"
                readonly
                type="text"
                style="text-align: right;"
                class="van-field__control"
                placeholder="请选择"
                @click="selectAssist"
              />
            </template>

            <!--右侧icon-->
            <template #right-icon>
              <svg-icon icon-class="arrow" style="font-size: 12px;"/>
            </template>
          </van-field>
        </van-form>
      </van-popup>

      <!--挂起弹层-->
      <van-popup v-model="hangShow" position="bottom">
        <p class="work-record">
          <span class="work-record-cancel" @click="hangShow=false">取消</span>
          <span class="work-record-title">挂起</span>
          <span class="work-record-submit" @click="$refs.hf.submit()">提交</span>
        </p>
        <van-form
          ref="hf"
          class="hang-time"
          validate-first
          :show-error-message="false"
          @submit="onHangSubmit"
        >
          <FwDateTime
            :model="hangForm"
            :minDateTime="new Date()"
            :opt="{code:'hang_expire', name: '预计解挂时间', required: true}"
          ></FwDateTime>

          <van-field
            v-model="hangForm.hang_reason"
            rows="4"
            type="textarea"
            show-word-limit
            maxlength="200"
            placeholder="请输入挂起意见，200字内"
          ></van-field>
        </van-form>
      </van-popup>

      <!--转单弹层-->
      <van-popup v-model="transShow" position="bottom">
        <p class="work-record">
          <span class="work-record-cancel" @click="transShow=false">取消</span>
          <span class="work-record-title">转单</span>
          <span class="work-record-submit" @click.stop="$refs.tf.submit()">提交</span>
        </p>
        <van-form ref="tf" validate-first :show-error-message="false" @submit="onTransSubmit">
          <van-field
            v-model="transForm.trans_to"
            clickable
            name="trans_to"
            input-align="right"
            class="fw-field pr"
            label="选择处理人"
            placeholder="请选择"
            :required="true"
            :rules="[{ required: true, message: '请选择' }] "
          >
            <!--展示框-->
            <template #input>
              <input
                v-model="transForm.trans_name"
                readonly
                type="text"
                style="text-align: right;"
                class="van-field__control"
                placeholder="请选择"
                @click="selectRelated"
              />
            </template>

            <!--右侧icon-->
            <template #right-icon>
              <svg-icon icon-class="arrow" style="font-size: 12px;"/>
            </template>
          </van-field>

          <van-field
            v-model="transForm.reason"
            required
            rows="4"
            type="textarea"
            show-word-limit
            maxlength="200"
            placeholder="请输入转单原因，200字内"
            :rules="[{ required: true, message: '请输入转单原因' }] "
            @focus="$refs.tf.resetValidation()"
          ></van-field>
        </van-form>
      </van-popup>

      <!--转单处理人弹层-->
      <van-popup v-model="transPopupShow" position="bottom" :get-container="getBodyContainer" :close-on-click-overlay="false">
        <p class="work-record">
          <span class="work-record-cancel" @click="transPopupShow=false">返回</span>
          <span class="work-record-title">选择处理人</span>
          <span class="work-record-submit"></span>
        </p>
        <div class="search-main" style="height: 265px;overflow-y: scroll;">
          <ul>
            <li
              v-for="(item,index) in transList"
              :key="index"
              class="search-item"
              @click="confirmSelect(item)"
            >
              <div class="search-flex">
                <div>{{ item.label }}<span>({{ item.role_name }})</span></div>
                <div :class="'empty-' + item.num">{{ item.num > 0 ? '待处理' + item.num : '空闲' }}</div>
              </div>
            </li>
          </ul>
        </div>
      </van-popup>

      <!--协办人弹层-->
      <van-popup v-model="assistPopupShow" position="bottom" :get-container="getBodyContainer" :close-on-click-overlay="false">
        <p class="work-record">
          <span class="work-record-cancel" @click="assistPopupShow=false">返回</span>
          <span class="work-record-title">选择协办人</span>
          <span class="work-record-submit"></span>
        </p>
        <div class="search-main" style="height: 265px;overflow-y: scroll;">
          <SelectAssist ref="SelectAssist" :defaultSelected="assistForm.candidate_list" :nodeInstanceId="order.todo_node_instance_id" @confirm="onAssistConfirm"></SelectAssist>
        </div>
      </van-popup>
      <!-- 转单-选择服务 -->
      <van-overlay :show="popupServiceShow" :lock-scroll="false" class="service-lay my-overlay" @click="overlayClose(popupServiceShow)">
        <template #default>
          <div @click.stop>
            <SelectService
              ref="ss"
              cancelText="取消"
              :apiParams="{entry_id: entryId, group_id:order.group_id}"
              @cancel="cancelService"
              @confirm="selectService"
            ></SelectService>
          </div>
        </template>
      </van-overlay>
      <van-overlay :show="pageLoading" class="download-overlay">
        <van-loading type="spinner" class="my-loading"></van-loading>
      </van-overlay>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import {
  wfeFlowInstanceOperateGrab,
  wfeFlowInstanceOperateRemind,
  wfeFlowInstanceOperateUrgent,
  wfeFlowInstanceOperateHangRelease,
  wfeFlowInstanceOperateAddNotes,
  wfeFlowInstanceOperateAddSupervise,
  wfeFlowInstanceOperateClose,
  wfeFlowInstanceOperateTrans,
  wfeFlowInstanceOperateHang,
  wfeFlowInstanceOperateTransCandidates
  , getAssistCandidates, setAssistCandidate,
  transferOrder,
  orderAdd
} from '@/api/wfe'

import FwDateTime from '@/views/formComponents/FwDateTime'
import FwUploadPhoto from '@/views/formComponents/FwUploadPhoto'
import SelectAssist from 'views/work/components/widgets/SelectAssist'
import SelectService from '@/views/formComponents/common/SelectService'
import { WorkOrderEntry, DeviceWorkTypes, SequenceWorkTypes, CleanWorkTypes, AppWorkOrderEntry } from '@/utils/const'
import { isApp, isShowDownload, centToYuan } from '@/utils/index'
import { mapGetters } from 'vuex'

export default {
  name: 'WorkAction',
  components: { FwDateTime, FwUploadPhoto, SelectAssist, SelectService },
  props: {
    order: {
      type: Object,
      default: () => {}
    },
    fromType: { // 来源
      type: String,
      default: () => 'list'
    },
    actions: {
      type: Array,
      default: () => []
    },
    isDownload: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      centToYuan,
      actionObjects: [
        { name: '催单',
          value: 'remind',
          fun: this.remindOrder,
          permission: {
            list: ['FPMS_OPERATION_CODE_WORKORDER_LIST_REMIND'],
            mine: ['FPMS_OPERATION_CODE_WORKORDER_MY_REMIND']
          }
        },
        { name: '追记',
          value: 'notes',
          fun: this.notesOrder,
          permission: {
            list: ['FPMS_OPERATION_CODE_WORKORDER_LIST_AFTERSIGN'],
            mine: ['FPMS_OPERATION_CODE_WORKORDER_MY_AFTERSIGN']
          }
        },
        { name: '转单', value: 'trans', fun: this.transOrder },
        { name: '挂起',
          value: 'hang',
          fun: this.hangOrder,
          permission: {
            list: ['FPMS_OPERATION_CODE_WORKORDER_LIST_HANG'],
            mine: ['FPMS_OPERATION_CODE_WORKORDER_MY_HANG']
          }
        },
        { name: '解挂',
          value: 'unhang',
          fun: this.unHangOrder,
          permission: {
            list: ['FPMS_OPERATION_CODE_WORKORDER_LIST_HANG'],
            mine: ['FPMS_OPERATION_CODE_WORKORDER_MY_HANG']
          }
        },
        { name: '督办',
          value: 'supervise',
          fun: this.superviseOrder,
          permission: {
            list: ['FPMS_OPERATION_CODE_WORKORDER_LIST_SUPERVISE'],
            mine: ['FPMS_OPERATION_CODE_WORKORDER_MY_SUPERVISE']
          }
        },
        { name: '关单',
          value: 'close',
          fun: this.closeOrder,
          permission: {
            list: ['FPMS_OPERATION_CODE_WORKORDER_LIST_CLOSE'],
            mine: ['FPMS_OPERATION_CODE_WORKORDER_MY_CLOSE']
          }
        },
        { name: '加急',
          value: 'urgent',
          fun: this.urgentOrder,
          permission: {
            list: ['FPMS_OPERATION_CODE_WORKORDER_LIST_URGENT'],
            mine: ['FPMS_OPERATION_CODE_WORKORDER_MY_URGENT']
          }
        },
        { name: '协办', value: 'assist', fun: this.assistOrder },
        { name: '转办',
          value: 'forward',
          fun: this.forwardOrder,
          permission: {
            list: [],
            mine: []
          }
        },
        { name: '下载', value: 'download', fun: this.downloadOrder },
        { name: '收款', value: 'pay', fun: this.payOrder }
      ],
      showPicker: false,

      recordShow: false, // 追记弹框
      closeShow: false, // 关单弹框
      closeReason: '', // 关单原因

      superviseShow: false, // 督办弹框
      superviseReason: '', // 督办原因

      assistShow: false, // 协办弹框
      assistForm: {
        candidate_list: []
      },
      assistPopupShow: false,

      hangShow: false, // 挂起弹框
      hangForm: {
        hang_expire: '', // 预计解挂时间
        hang_reason: '' // 挂起原因
      },

      transShow: false, // 转单弹框
      transForm: {
        trans_to: '',
        reason: '',
        trans_name: ''
      },
      transList: [],
      transPopupShow: false,

      form: {
        content: '',
        pictures: ''
      },
      popupServiceShow: false,
      entryId: isApp() ? AppWorkOrderEntry.takePlace.value : WorkOrderEntry.takePlace.value,
      isApp: isApp(),
      isShowDownload: isShowDownload('1.2.1'),
      pageLoading: false
    }
  },
  watch: {
    order: {
      handler (newValue, oldValue) {
        this.order = newValue
      },
      deep: true
    }
  },
  computed: {
    ...mapGetters(['token']),
    // 底部按钮
    showActions () {
      // 有偿工单支付按钮的判断,正常结束，但是未支付=》显示
      if (this.order.status === 9) {
        return this.actionObjects.filter(item => {
          // 有偿工单的支付 已经生成账单&&未支付
          if (item.value === 'pay') {
            return (this.order.cost_detail && this.order.cost_detail.cost_bill_no) && (this.order.cost_detail && this.order.cost_detail.pay_state === 1)
          }
          return false
        })
      }
      // 只有 处理中 和 挂起中才返回操作
      if (this.order.status === 1 || this.order.status === 2) {
        return this.actionObjects.filter(item => {
          const access = this.hasPermission(item.permission ? item.permission[this.fromType] : [])
          // 挂起 只有在处理中的状态时才可以；并且有权限；并且允许挂起
          if (item.value === 'hang') {
            return access && this.order.status === 1 && this.order['allow_hang']
          }
          // 解挂 只有在挂起中的状态时才可以；并且有权限；并且允许挂起
          if (item.value === 'unhang') {
            return access && this.order.status === 2 && this.order['allow_hang']
          }
          // 转单 只有在处理中的状态并且允许转单时才可以
          if (item.value === 'trans') {
            return this.order.status === 1 && this.order['allow_trans'] === true
          }
          // 协办 只有在处理中的状态并且允许协办时才可以
          if (item.value === 'assist') {
            return this.order.status === 1 && this.order['allow_co'] === true
          }
          // 催单 当前处理人不是自己
          if (item.value === 'remind') {
            return !this.order.is_my_todo
          }
          // 转办
          if (item.value === 'forward') {
            return this.order.source === 3
          }
          // 我的待办-下载 必须在app端 && 只在我的待办页面或者我的待办的详情页 && 已经抢单了 && 来源是工程保养、工程巡检、环境、秩序计划工单
          if (item.value === 'download') {
            return this.isApp && this.isShowDownload && this.isDownload && this.allRight() && (this.order.is_my_todo && !this.order.need_grab && this.order.status === 1) && (this.order.source === 5 || this.order.source === 4 || this.order.source === 6 || this.order.source === 7)
          }
          // 有偿工单的支付 已经生成账单&&未支付
          if (item.value === 'pay') {
            return (this.order.cost_detail && this.order.cost_detail.cost_bill_no) && (this.order.cost_detail && this.order.cost_detail.pay_state === 1)
          }

          return access
        })
      } else {
        return []
      }
    },
    // 更多按钮
    moreActions () {
      return this.showActions.slice(3)
    },
    // 抢单按钮
    showGrab () {
      return this.order.is_my_todo && this.order.need_grab && this.order.status === 1
    },
    // 处理按钮
    showDeal () {
      return this.order.is_my_todo && !this.order.need_grab && this.order.status === 1
    },
    candidateName () {
      return `已选中${this.assistForm.candidate_list.length}人`
    }
  },
  methods: {
    // 当前工单是否处理完
    allRight () {
      let isRight = false
      if (DeviceWorkTypes.includes(this.order.source) && (this.order.task_device && this.order.task_device.eng_group.devices && this.order.task_device.eng_group.devices.some(item => !item.commit_id))) {
        isRight = true
      }
      if (CleanWorkTypes.includes(this.order.source) && (this.order.task_cleaning && this.order.task_cleaning.cleaning_group.location_points && this.order.task_cleaning.cleaning_group.location_points.some(item => !item.commit_id))) {
        isRight = true
      }
      if (SequenceWorkTypes.includes(this.order.source) && (this.order.task_guardian && this.order.task_guardian.guardian_group.location_points && this.order.task_guardian.guardian_group.location_points.some(item => !item.commit_id))) {
        isRight = true
      }
      // if (QualityWorkTypes.includes(this.order.source) && (this.order.quality_group && this.order.task_guardian.guardian_group.location_points && this.order.task_guardian.guardian_group.location_points.some(item => !item.commit_id))) {
      //   isRight = true 品质检查
      // }
      return isRight
    },
    // 有偿工单支付
    payOrder () {
      const data = {
        cost_detail_id: this.order.cost_detail.cost_detail_id
      }
      orderAdd(data).then(res => {
        if (res.code === 200) {
          const ishttps = document.location.protocol === 'https:'
          const domainExtra = process.env.VUE_APP_ENVIRONMENT === '-test' ? '.fw' : ''
          location.href = `${ishttps ? 'https' : 'http'}://finance${process.env.VUE_APP_ENVIRONMENT}${domainExtra}.gmtech.top/app/check-stand?order_id=${res.data.order_id}&project_id=${res.data.project_id}&token=${this.token}`
        }
      })
    },
    // 下载工单
    downloadOrder () {
      // 请求接口并给work-list组件传递状态
      const data = []
      data.push(this.order.record_id)
      if (isApp()) {
        this.setDownloadText('', 1)
        this.pageLoading = true
        this.downloadWorkorder(data, (res) => {
          this.pageLoading = false
          // 返回下载成功的工单的record_id的数组
          // 判断是否下载过
          if (!res) {
            this.setDownloadText('', 2)
            return
          }
          if (res.length) {
            this.$toast('下载成功')
            this.setDownloadText('下载成功', 2)
            setTimeout(() => {
              this.setDownloadText('离线工单', 2)
            }, 3000)
            return
          }
          this.setDownloadText('下载失败', 3)
        })
      }
    },
    setDownloadText (text, status) {
      // text 为下载提示->列表中需要，status 为下载状态->详情中需要
      this.$set(this.order, '_downloadText', text)
      this.$set(this.order, '_downloadStatus', status)
      this.$emit('result', this.order)
    },
    // 取消转单
    cancelService () {
      this.popupServiceShow = false
    },
    // 确定转单
    selectService (res) {
      const categoryId = res.item.service_id
      const subCategoryId = res.subItem.service_id
      if (!categoryId) {
        return
      }
      if (!subCategoryId) {
        return
      }
      const data = {
        flow_instance_record_id: this.order.record_id,
        biz_service_id: categoryId,
        biz_subservice_id: subCategoryId
      }
      transferOrder(data).then(res => {
        if (res.code === 200) {
          this.$toast('转办成功，可在工单列表中查看' || res.msg)
          this.popupServiceShow = false
          this.$emit('refresh')
        } else {
          this.$toast(res.msg)
        }
      })
    },
    // 选择动作
    selectAction (item, index) {
      item.fun && item.fun()
    },

    // 处理，此处处理逻辑需要区分工单类型，涉及到调用设备详情、秩序详情、环境详情接口，所以不在该组件里做逻辑处理
    dealOrder () {
      this.$emit('deal')
    },

    // 协办
    assistOrder () {
      this.assistShow = true
      getAssistCandidates({ node_instance_id: this.order.todo_node_instance_id }).then(res => {
        if (res.code === 200) {
          const resData = res.data || []
          this.$set(this.assistForm, 'candidate_list', resData.map(item => item.staff_id))
        }
      })
    },

    selectAssist () {
      this.assistPopupShow = true
      this.$nextTick(() => {
        this.$refs.SelectAssist.show()
      })
    },

    onAssistConfirm (val) {
      this.assistPopupShow = false
      this.assistForm.candidate_list = val
    },

    // 选择处理人弹层
    selectRelated () {
      this.transPopupShow = true
      if (!this.transList.length) {
        this.getTransCandidates()
      }
    },
    // 选择处理人
    confirmSelect (item) {
      this.transForm.trans_to = item.value
      this.transForm.trans_name = item.label
      this.transPopupShow = false
    },

    // 获取转单候选人列表
    getTransCandidates () {
      wfeFlowInstanceOperateTransCandidates({
        node_instance_id: this.order.todo_node_instance_id
      }).then(res => {
        if (res.code === 200) {
          this.transList = res.data || []
          return
        }
        this.$toast(res.msg || '获取处理人失败')
      })
    },

    // 抢单
    grabOrder () {
      wfeFlowInstanceOperateGrab({
        flow_instance_id: this.order.record_id,
        node_instance_id: this.order.todo_node_instance_id
      }).then(res => {
        if (res.code === 200) {
          this.$toast('抢单成功')
          this.$emit('refresh')
          return
        }
        this.$toast(res.msg || '抢单失败')
      })
    },

    // 催单
    remindOrder () {
      wfeFlowInstanceOperateRemind({
        flow_instance_id: this.order.record_id,
        node_instance_id: this.order.todo_node_instance_id
      }).then(res => {
        if (res.code === 200) {
          this.$toast('催单成功')
          this.$emit('refresh')
          return
        }
        this.$toast(res.msg || '催单失败')
      })
    },

    // 追记
    notesOrder () {
      this.recordShow = true
      this.form = {
        content: '',
        pictures: ''
      }
    },

    /**
     * 协办人
     */
    onAssistSubmit () {
      const candidateList = this.assistForm.candidate_list.map(item => `B#${item}`)
      const data = {
        node_instance_id: this.order.todo_node_instance_id,
        candidate_list: candidateList
      }
      this.assistShow = false
      setAssistCandidate(data).then(res => {
        if (res.code === 200) {
          this.$toast('操作成功')
          this.$emit('refresh')
          return
        }
        this.$toast(res.msg || '操作失败')
      })
    },

    // 追记表单提交
    onSubmit () {
      // 判断是否有图片在上传中
      let comps = this.findChildren(this.$children)
      comps = comps.filter(item => item.$options.name === 'UploadComponent' && item.loading)
      if (comps && comps.length) {
        this.$toast('请等待图片上传完成')
        return
      }

      const params = {
        flow_instance_id: this.order.record_id,
        node_instance_id: this.order.todo_node_instance_id,
        ...this.form
      }
      if (params.pictures) {
        params.pictures = JSON.stringify(params.pictures)
      }
      this.recordShow = false
      wfeFlowInstanceOperateAddNotes(params).then(res => {
        if (res.code === 200) {
          this.$toast('追记成功')
          this.$emit('refresh')
          return
        }
        this.$toast(res.msg || '追记失败')
      })
    },

    // 转单
    transOrder () {
      this.transShow = true
      this.$refs.tf && this.$refs.tf.resetValidation()
      this.transForm = {
        trans_to: '',
        reason: '',
        trans_name: ''
      }
    },
    // 转单表单提交
    onTransSubmit () {
      const params = {
        flow_instance_id: this.order.record_id,
        node_instance_id: this.order.todo_node_instance_id,
        ...this.transForm
      }

      this.transShow = false
      wfeFlowInstanceOperateTrans(params).then(res => {
        if (res.code === 200) {
          this.$toast('转单成功')
          this.$emit('refresh')
          return
        }
        this.$toast(res.msg || '转单失败')
      })
    },

    // 挂起
    hangOrder () {
      this.hangShow = true
      this.$refs.hf && this.$refs.hf.resetValidation()
      this.hangForm = {
        hang_expire: '', // 预计解挂时间
        hang_reason: '' // 挂起原因
      }
    },
    // 挂起表单提交
    onHangSubmit () {
      const param = {
        flow_instance_id: this.order.record_id,
        ...this.hangForm
      }

      param.hang_expire = dayjs(param.hang_expire).format()

      this.hangShow = false
      wfeFlowInstanceOperateHang(param).then(res => {
        if (res.code === 200) {
          this.$toast('挂起成功')
          this.$emit('refresh')
          return
        }
        this.$toast(res.msg || '挂起失败')
      })
    },

    // 解挂
    unHangOrder () {
      this.$confirm({
        title: '提示',
        message: '确定解挂工单吗？',
        confirmButtonColor: '#BC8D58'
      }).then(() => {
        wfeFlowInstanceOperateHangRelease({
          flow_instance_id: this.order.record_id
        }).then(res => {
          if (res.code === 200) {
            this.$toast('解挂成功')
            this.$emit('refresh')
            return
          }
          this.$toast(res.msg || '解挂失败')
        })
      })
    },

    // 督办
    superviseOrder () {
      this.superviseShow = true
    },

    // 督办表单提交
    onSuperviseSubmit () {
      if (!this.superviseReason) {
        this.$toast('请先填写督办意见')
        return
      }

      this.superviseShow = false
      wfeFlowInstanceOperateAddSupervise({
        flow_instance_id: this.order.record_id,
        node_instance_id: this.order.todo_node_instance_id,
        content: this.superviseReason
      }).then(res => {
        if (res.code === 200) {
          this.$toast('督办成功')
          this.$emit('refresh')
          return
        }
        this.$toast(res.msg || '督办失败')
      })
    },

    // 关单
    closeOrder () {
      this.closeShow = true
    },
    // 关单表单提交
    onCloseSubmit () {
      this.closeShow = false
      wfeFlowInstanceOperateClose({
        flow_instance_id: this.order.record_id,
        remarks: this.closeReason
      }).then(res => {
        if (res.code === 200) {
          this.$toast('关单成功')
          this.$emit('refresh')
          return
        }
        this.$toast(res.msg || '关单失败')
      })
    },

    // 加急
    urgentOrder () {
      this.$confirm({
        title: '提示',
        message: '确定加急工单吗？',
        confirmButtonColor: '#BC8D58'
      }).then(() => {
        wfeFlowInstanceOperateUrgent({
          flow_instance_id: this.order.record_id
        }).then(res => {
          if (res.code === 200) {
            this.$toast('加急成功')
            this.$emit('refresh')
            return
          }
          this.$toast(res.msg || '加急失败')
        })
      })
    },
    // 转单
    forwardOrder () {
      this.popupServiceShow = true
      this.$refs.ss.show()
    }
  }
}
</script>

<style lang="scss" scoped>
  .amount-content{
    position: relative;
    padding: 10px 0;
    background: #fff;
    border-bottom: 1px solid #eee;
    border-top: 1px solid #eee;
    width: 100%;
    .amount{
      font-size: 16px;
      font-weight: bold;
      text-align: right;
    }
    .amount-payment{
      font-size: 14px;
      text-align: right;
    }
  }
.service-lay>div{
  height: 100vh;
}
.operation {
  margin: 16px 0;
  position: relative;
}

.download-overlay{
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
}
.work {
  &-operation {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    background: #fff;
    box-sizing: border-box;
  }

  &-action {
    display: flex;
    align-items: center;
  }

  &-more {
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: #E1AA6C;
  }

  &-button {
    margin-left: 12px;
    border-color: #E1AA6C;
    color: #E1AA6C;
    min-width: 60px;
    font-size: 14px;
  }

  &-line {
    width: 1px;
    height: 32px;
    background: #E1AA6C;
    margin: 0 12px;
    display: inline-block;
  }

  &-record {
    padding: 12px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;

    &-title {
      font-size: 16px;
      color: #333;
      line-height: 24px;
      font-weight: 500;
      font-family: PingFangSC-Medium, PingFang SC;
    }

    &-cancel, &-submit {
      font-size: 14px;
      color: #666;
      line-height: 20px;
      font-weight: 400;
    }

    &-submit {
      color: #BC8D58;
    }
  }

  &-uploader {
    display: flex;
    flex-direction: column;
  }
}

.search-main {
  .search-item {
    padding: 16px 17px;
    border-top: 1px solid #E5E5E5;
  }

  .search-flex {
    display: flex;
  }

  .search-main {
    height: 265px;
    overflow: auto;
  }

  .search-flex > div {
    font-size: 14px;
    color: #FFAB2D;
    line-height: 20px;
    background: #FEF3E1;
    border-radius: 4px;
    padding: 0 6px;

    &.empty-0 {
      color: #72C937;
      background: #EBF7E3;
    }
  }

  .search-flex > div:first-child {
    font-size: 14px;
    color: #333333;
    line-height: 20px;
    flex: 1;
    background: none;

    span {
      color: #999999;
      padding-left: 5px;
    }
  }
}

.btn {
  ::v-deep .van-field {
    border-top: none;
  }
}

.field-space {
  height: 12px;
  border-top: 1px solid #EFEFEF;
}

.deal {
  min-width: 1.6rem;
  font-size: 14px;
}
</style>
