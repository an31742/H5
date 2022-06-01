<template>
  <div class="detail">
    <van-tabs v-model="active" color="#E1AA6C">
      <!-- 审批详情 -->
      <van-tab title="审批详情">
        <div class="detail-content" :class="{full: actions && actions.length < 1}">
          <!-- 申请信息 -->
          <div class="detail-main">
            <p class="detail-item">
              <span class="detail-name">审批编号</span>
              <span class="detail-text">{{ flowInstance.no }}</span>
            </p>
            <p class="detail-item">
              <span class="detail-name">提单人</span>
              <span class="detail-text">{{ flowInstance.launcher_name }}</span>
            </p>
            <p class="detail-item">
              <span class="detail-name">所在节点</span>
              <span class="detail-text">{{ flowInstance.dep_name }}</span>
            </p>
            <p class="detail-item">
              <span class="detail-name">申请时间</span>
              <span class="detail-text">{{ flowInstance.created | timeFilter }}</span>
            </p>
          </div>

          <!-- 表单 start -->
          <van-form v-if="hasAgree" ref="approveForm" validate-first scroll-to-error @submit="handleSubmit">
            <fc
              ref="fc"
              :model="formData"
              :options="widgetForm"
              :launcherId="flowInstance.launcher_id"
            />
          </van-form>
          <detail v-else :formData="formData" style="margin: 0.32rem 0;" />

          <!-- 抄送 -->
          <div v-if="approveCCList && approveCCList.length" class="detail-cc">
            <p class="detail-name">抄送</p>
            <van-grid :column-num="5" :border="false">
              <van-grid-item v-for="(item, index) in approveCCList" :key="index">
                <van-image round fit="cover" width="41" height="41" :src="item.avatar || require('@/assets/image/user.png')"></van-image>
                <span class="detail-cc-name van-ellipsis">{{ item.name }}</span>
              </van-grid-item>
            </van-grid>
          </div>

          <template v-if="actions && actions.length">
            <!--占位div 高度等于顶部tab的高度-->
            <div style="height: 1.70667rem;"></div>
            <!-- 操作栏 -->
            <action
              ref="action"
              :actions="actions"
              :extraData="extraData"
              :flowTplId="flowTplId"
              :flowTplType="flowTplType"
              :flowInstanceId="flowInstance.record_id"
              :nodeCandidateId="nodeCandidateId"
              @validate="validateForm"
              @ok="init"
            ></action>
          </template>
        </div>
      </van-tab>

      <!-- 审批记录 -->
      <van-tab title="审批记录">
        <div v-if="trackData && trackData.length" class="edit-step">
          <locus :trackData="trackData"></locus>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import { string2obj } from '@/utils'
import locus from './components/locus'
import action from './components/action'
import detail from '@/views/formApprove/detail'
import fc from '@/views/formApprove/index'
import { getProcedureItemDetail, getProcedureItemLocus, getProcedureItemDetailByNodeInstanceId, approvalFlowInstanceRead } from '@/api/approve'
import { setApplyLaunderItem } from './util'

export default {
  name: 'ApproveDetail',
  components: { action, detail, locus, fc },
  data () {
    return {
      active: 0,
      flowDetail: {},
      flowInstance: {},
      formData: {},
      nodeInstance: [],
      approveCCList: [],
      trackData: [],
      flowTplId: '',
      flowTplType: 1,
      flowInstanceId: this.$route.query.instanceId,
      nodeCandidateId: this.$route.query.nodeId,
      noticeId: this.$route.query.noticeId,
      actions: [],
      hasAgree: false,
      currentNode: {},
      extraData: {},
      widgetForm: [],
      subjectSetting: []
    }
  },
  created () {
    this.init()

    console.log('extraData', this.extraData)
  },
  methods: {
    // 初始化
    init () {
      console.log('----------------')
      this.getItemDetail()
      // 消息阅读，目前仅限"抄送我的"详情
      if (this.noticeId) {
        approvalFlowInstanceRead({
          id: this.noticeId,
          type: 'cc'
        })
      }
    },

    // 申请详情
    getItemDetail () {
      let api = getProcedureItemDetail
      let params = { flow_instance_id: this.flowInstanceId }
      if (this.nodeCandidateId) {
        api = getProcedureItemDetailByNodeInstanceId
        params = { node_candidate_id: this.nodeCandidateId }
      }

      api(params).then(res => {
        if (res.code === 200) {
          const data = res.data || {}
          this.approveCCList = data['cc_list'] || []
          this.flowDetail = data['flow'] || []
          this.actions = data['action'] || []
          this.flowInstance = data['flow_instance'] || []
          this.nodeInstance = data['node_instance'] || []

          this.formData = this.flowInstance['form_data'] ? string2obj(this.flowInstance['form_data']) : null
          this.hasAgree = this.actions.includes('agree')

          if (data['flow_tpl']) {
            this.flowTplId = data['flow_tpl'].id || ''
            this.flowTplType = data['flow_tpl'].type || 1
          }
          // 同意操作时候，展示可编辑的表单
          if (this.hasAgree) {
            try {
              this.subjectSetting = data.flow_tpl && data.flow_tpl.subject && data.flow_tpl.subject.split(',')
              this.currentNode = data.current_node && data.current_node.node_property || {}
              this.extraData.rejectOptions = null
              if (data.current_node && data.current_node && data.current_node.node_property && data.current_node.node_property.action && data.current_node.node_property.action.reject_options) {
                this.extraData.rejectOptions = data.current_node.node_property.action.reject_options
              }
              const arr = JSON.parse(data.flow_instance.form)
              if (Array.isArray(arr)) {
                const list = this.formatVisible(arr)
                // 仓储管理的是否加急 金额 不展示
                this.widgetForm = list.filter(item => {
                  return data.flow_tpl.tpl_code !== 'caigoushenqingv2' || (item && item.type !== 'FormRadioBox' && item.code !== 'urgent') && (item && item.type !== 'FormMoney' && item.code !== 'amount')
                })
              } else {
                this.widgetForm = []
              }
            } catch (e) {
              this.widgetForm = []
            }
          }

          setApplyLaunderItem(
            {
              allowReplace: res.data.flow_tpl.allow_replace,
              launcherScope: res.data.flow_tpl.launcher_scope,
              templateId: res.data.flow_tpl.id,
              applyLauncher: this.flowInstance.apply_launcher_id,
              visibility: 1
            }
            ,
            this.widgetForm
          )
          this.getItemLocus()
        } else {
          this.$toast(res.msg || '获取信息失败')
        }
      })
    },

    // 审批记录
    getItemLocus () {
      getProcedureItemLocus({ flow_instance_id: this.flowInstance.record_id }).then(res => {
        if (res.code === 200) {
          this.trackData = res.data['locus_list'] || []
        } else {
          this.$toast(res.msg || '获取审批记录失败')
        }
      })
    },

    validateForm () {
      if (this.$refs.approveForm) {
        this.$refs.approveForm.submit()
      }
    },

    handleSubmit () {
      this.formData.frontFormLabels = this.widgetForm.map(item => {
        return { name: item.name, code: item.code, type: item.type, props: item.props || {} }
      })

      this.extraData = {
        subject: this.flowInstance.subject,
        form_data: JSON.stringify(this.formData)
      }

      this.$refs.action.showAgreeModal()
    },

    formatVisible (arr) {
      const formVisibility = this.currentNode['form_visibility'] || {}
      arr.map(item => {
        item.visibility = formVisibility[item.code] && formVisibility[item.code].visibility || 1
        if (this.formData[item.code]) {
          item.value = this.formData[item.code]
        }
        return item
      })

      return arr
    },

    getFileList (arr) {
      const newArr = []
      arr.forEach(item => {
        newArr.push({ url: item })
      })
      return newArr
    }
  }
}
</script>

<style lang="scss" scoped>
  .detail {
    background: #F6F8FA;
    height: 100%;
    // padding-bottom: 64px;

    &-main {
      background: #fff;
      margin: 12px 0 12px;
    }

    &-item {
      padding: 17px 16px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #EFEFEF;

      &:last-child {
        border-bottom: 0;
      }
    }

    &-name, &-text {
      font-size: 14px;
      color: #333;
      line-height: 20px;
      font-weight: 400;
    }

    &-text {
      color: #999;
    }

    &-cc {
      background: #fff;
      padding: 17px 16px 20px;
      box-sizing: border-box;
      margin: 12px 0;

      &-name {
        font-size: 13px;
        color: #666;
        line-height: 22px;
        font-weight: 400;
        margin-top: 8px;
        width: 50px;
        text-align: center;
      }
    }

    &-content {
      height: calc(100vh - 44px);
      height: calc(100vh - 44px - constant(safe-area-inset-bottom));
      height: calc(100vh - 44px - env(safe-area-inset-bottom));
      overflow: scroll;
    }
  }

  .edit-step {
    margin: 4px 0 0;
    height: calc(100vh - 48px);
    height: calc(100vh - 48px - constant(safe-area-inset-bottom));
    height: calc(100vh - 48px - env(safe-area-inset-bottom));
    overflow: scroll;
  }

  ::v-deep .van-grid-item__content {
    padding-top: 20px;
    padding-bottom: 0;
  }
  ::v-deep .van-tabs__line {
    z-index: 0 !important;
  }

  ::v-deep {
    .van-step__line {
      background-color: #EAC9A5;
    }
    .van-step__circle-container {
      width: 12px;
    }
    .van-step--process .van-step__line:after {
      border: none;
    }
    .van-steps__items {
      &>div {
        padding-left: 10px;
        padding-top: 10px;
      }
    }

    .van-step--vertical:not(:last-child)::after {
      border-bottom-width: 0;
    }
  }
</style>
