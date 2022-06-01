<template>
  <div class="action approveAction fixed-bottom">
    <!-- 更多 -->
    <span v-if="moreActions.length > 0" class="action-more" @click="showPicker = true">更多</span>
    <!--更多弹层-->
    <van-action-sheet
      v-model="showPicker"
      :actions="moreActions"
      cancel-text="取消"
      close-on-click-action
      @cancel="showPicker=false"
      @select="selectAction"
    ></van-action-sheet>

    <!--左侧按钮-->
    <van-button
      v-for="(item, index) in showActions.slice(1, 4).reverse()"
      :key="index"
      type="default"
      round
      size="small"
      class="action-button"
      @click="item.fun()"
    >
      {{ item.name }}
    </van-button>

    <!-- 左边 分割线 -->
    <span v-if="showActions.length > 1" class="action-line"></span>
    <!-- 右边 分割线 -->

    <!--右侧按钮-->
    <van-button
      v-if="rightAction"
      type="primary"
      round
      size="small"
      class="action-primary"
      color="linear-gradient(45deg, #F2D5A5 0%, #E1AA6C 100%)"
      @click="rightAction.fun()"
    >
      {{ rightAction && rightAction.name }}
    </van-button>

    <!-- 抄送弹框 -->
    <van-popup v-model="ccShow" position="bottom" class="minH">
      <p class="action-record">
        <span class="action-record-cancel" @click="ccShow = false">取消</span>
        <span class="action-record-title">抄送</span>
        <span class="action-record-submit" @click.stop="$refs.cc.submit()">提交</span>
      </p>
      <van-form ref="cc" validate-first @submit="onCCSubmit">
        <!-- 选择抄送人 -->
        <link-staff ref="ccls" class="link-staff" searchTip="请输入员工姓名进行搜索" :model="ccLinkModel" :opt="ccLinkOpt"></link-staff>
      </van-form>
    </van-popup>

    <!-- 评论弹出框 -->
    <van-popup v-model="commentShow" position="bottom">
      <p class="action-record">
        <span class="action-record-cancel" @click="commentShow = false">取消</span>
        <span class="action-record-title">评论</span>
        <span class="action-record-submit" @click.stop="$refs.comment.submit()">提交</span>
      </p>
      <van-form ref="comment" validate-first @submit="onCommentSubmit">
        <!-- 评论内容 -->
        <van-field
          v-model="commentReason"
          required
          rows="4"
          type="textarea"
          show-word-limit
          maxlength="200"
          label="评论内容"
          placeholder="必填项，请输入评论内容，200字内。"
          :error="false"
          :class="{overSize: commentReason.length >= 200}"
          :rules="[{ required: true, message: '请输入评论内容' }] "
        ></van-field>
        <!-- 上传图片 -->
        <van-field
          required
          clickable
          name="radio"
          class="fw-field pr"
          label="上传图片"
          placeholder="请上传图片"
          :rules="[{ required: true, message: '请上传图片' }]"
        >
          <template #input>
            <upload
              ref="upload"
              :max="5"
              :fileList="commentUploadImg"
              uploadStyle="padding: 0;"
              @change="(list) => commentUploadImg = list"
            >
              <slot>
                <div class="van-uploader__upload">
                  <i class="van-icon van-icon-plus van-uploader__upload-icon"></i>
                  <span class="van-uploader__upload-text">上传图片</span>
                </div>
              </slot>

              <template #preview-cover="{ item }">
                <slot name="preview-cover" :item="item"></slot>
              </template>
            </upload>
          </template>
        </van-field>
        <!-- 通知相关人 -->
        <link-staff
          ref="ls"
          style="margin-bottom: 42px;"
          class="link-staff"
          searchTip="请输入员工姓名进行搜索"
          :model="commentLinkModel"
          :opt="commentLinkOpt"
        ></link-staff>
      </van-form>
    </van-popup>

    <!-- 拒绝弹出框 -->
    <van-popup v-model="refuseShow" position="bottom">
      <p class="action-record">
        <span class="action-record-cancel" @click="refuseShow = false">取消</span>
        <span class="action-record-title">不同意</span>
        <span class="action-record-submit" @click.stop="$refs.refuse.submit()">提交</span>
      </p>
      <van-form ref="refuse" validate-first @submit="onRefuseSubmit">
        <van-field name="radio" label="回退至" required :rules="[{required: true, message: '请选择回退类型'}]">
          <template #input>
            <van-radio-group v-model="refuseForm.refuse_to_type" direction="horizontal">
              <van-radio v-if="options.includes(3)" icon-size="0.4533rem" checked-color="#E1AA6C" :name="3">上一节点</van-radio>
              <van-radio v-if="options.includes(2)" icon-size="0.4533rem" checked-color="#E1AA6C" :name="2">指定节点</van-radio>
              <van-radio v-if="options.includes(1)" icon-size="0.4533rem" checked-color="#E1AA6C" :name="1">提单节点</van-radio>
            </van-radio-group>
          </template>
        </van-field>
        <!-- 指定节点 -->
        <van-field
          v-if="refuseForm.refuse_to_type===2"
          v-model="refuseForm.node_id"
          required
          clickable
          name="radio"
          class="fw-field pr refuse-node"
          label="指定节点"
          :rules="[{ required: true, message: '请选择请选择回退节点' }]"
        >
          <template #input>
            <div v-if="refuseNodeList.length>0" class="action-refuse">
              <p
                v-for="(item, index) in refuseNodeList"
                :key="index"
                class="action-refuse-node"
                :class="{'action-refuse-active': refuseForm.node_id === item.record_id}"
                @click="refuseNodeSelect(item)"
              >{{ item.name }}</p>
            </div>
            <div v-else style="color: gray;text-align: center;width: 100%;font-size: 14px;">无可用节点</div>
          </template>
        </van-field>
        <!-- 回退方式 -->
        <van-field
          v-if="refuseForm.refuse_to_type===2"
          key="specifyBackType"
          name="radio"
          label="回退方式"
          required
          :rules="[{required: true, message: '请选择回退方式'}]"
        >
          <template #input>
            <van-radio-group v-model="refuseForm.refuse_next_type" direction="horizontal">
              <van-radio :disabled="!specifiedNodeType.includes(1)" icon-size="0.4533rem" checked-color="#E1AA6C" :name="1">直接提交给我</van-radio>
              <van-radio :disabled="!specifiedNodeType.includes(2)" icon-size="0.4533rem" checked-color="#E1AA6C" :name="2">流程重走</van-radio>
            </van-radio-group>
          </template>
        </van-field>
        <van-field
          v-if="refuseForm.refuse_to_type===1"
          key="submitBackType"
          name="radio"
          label="回退方式"
          required
          :rules="[{required: true, message: '请选择回退方式'}]"
        >
          <template #input>
            <van-radio-group v-model="refuseForm.refuse_next_type" direction="horizontal">
              <van-radio :disabled="!submitNodeType.includes(1)" icon-size="0.4533rem" checked-color="#E1AA6C" :name="1">直接提交给我</van-radio>
              <van-radio :disabled="!submitNodeType.includes(2)" icon-size="0.4533rem" checked-color="#E1AA6C" :name="2">流程重走</van-radio>
            </van-radio-group>
          </template>
        </van-field>
        <!-- 审批意见 -->
        <van-field
          v-model="refuseForm.content"
          required
          rows="5"
          type="textarea"
          show-word-limit
          maxlength="200"
          label="理由"
          placeholder="必填项，请输入理由，200字内。"
          :error="false"
          :class="{overSize: refuseForm.content.length >= 200}"
          :rules="[{ required: true, message: '请输入理由' }] "
        ></van-field>
      </van-form>
    </van-popup>

    <!-- 催办弹框 -->
    <van-popup v-model="urgingShow" position="bottom">
      <p class="action-record">
        <span class="action-record-cancel" @click="urgingShow = false">取消</span>
        <span class="action-record-title">催办</span>
        <span class="action-record-submit" @click.stop="$refs.urging.submit()">提交</span>
      </p>
      <van-form ref="urging" validate-first @submit="onUrgingSubmit">
        <!-- 评论内容 -->
        <van-field
          v-model="urgingReason"
          rows="4"
          type="textarea"
          show-word-limit
          maxlength="200"
          label="请填写催办内容"
          :class="{overSize: urgingReason.length >= 200}"
          placeholder="请输入催办内容，200字内。"
        ></van-field>
        <!-- 选择催办人 -->
        <urgeStaff ref="us" class="link-staff" :flowInstanceId="flowInstanceId" :model="urgingLinkModel" :opt="urgingLinkOpt"></urgeStaff>
      </van-form>
    </van-popup>

    <!-- 同意弹出框 -->
    <van-popup v-model="agreeShow" position="bottom">
      <p class="action-record">
        <span class="action-record-cancel" @click="agreeShow = false">取消</span>
        <span class="action-record-title">同意</span>
        <span class="action-record-submit" @click.stop="$refs.agree.submit()">提交</span>
      </p>
      <van-form ref="agree" validate-first @submit="onAgreeSubmit">
        <van-field
          v-model="approveReason"
          rows="10"
          type="textarea"
          show-word-limit
          maxlength="200"
          label="理由"
          :class="{overSize: approveReason.length >= 200}"
          placeholder="请输入理由，200字内。"
          class="textarea"
          @focus="$refs.agree.resetValidation()"
        ></van-field>
      </van-form>
    </van-popup>

    <!-- 转办弹框 -->
    <van-popup v-model="transferShow" position="bottom" class="minH">
      <p class="action-record">
        <span class="action-record-cancel" @click="transferShow = false">取消</span>
        <span class="action-record-title">转办</span>
        <span class="action-record-submit" @click.stop="$refs.transfer.submit()">提交</span>
      </p>
      <van-form ref="transfer" validate-first @submit="onTransferSubmit">
        <!-- 选择转办人 -->
        <link-staff
          ref="transls"
          class="link-staff"
          searchTip="请输入员工姓名进行搜索"
          :model="transferLinkModel"
          :max="1"
          :opt="transferLinkOpt"
        ></link-staff>
      </van-form>
    </van-popup>

    <!-- 加签弹框 -->
    <van-popup v-model="signShow" position="bottom" class="minH">
      <p class="action-record">
        <span class="action-record-cancel" @click="signShow = false">取消</span>
        <span class="action-record-title">加签</span>
        <span class="action-record-submit" @click.stop="$refs.sign.submit()">提交</span>
      </p>
      <van-form ref="sign" validate-first @submit="onSignSubmit">
        <!-- 选择转办人 -->
        <link-staff ref="addls" class="link-staff" searchTip="请输入员工姓名进行搜索" :model="signLinkModel" :opt="signLinkOpt"></link-staff>
      </van-form>
    </van-popup>

    <!--撤回弹框-->
    <van-popup v-model="withdrawShow" position="bottom">
      <p class="action-record">
        <span class="action-record-cancel" @click="withdrawShow = false">取消</span>
        <span class="action-record-title">撤回</span>
        <span class="action-record-submit" @click.stop="$refs.withdraw.submit()">提交</span>
      </p>
      <van-form ref="withdraw" validate-first @submit="onWithdrawSubmit">
        <!-- 评论内容 -->
        <van-field
          v-model="withdrawReason"
          rows="4"
          required
          type="textarea"
          show-word-limit
          maxlength="200"
          label="理由"
          placeholder="请输入理由，200字内。"
          :error="false"
          :class="{overSize: withdrawReason.length >= 200}"
          :rules="[{ required: true, message: '请输入理由' }] "
        ></van-field>
      </van-form>
    </van-popup>
  </div>
</template>

<script>
import linkStaff from '@/views/formApprove/FormLinkStaff'
import upload from '@/views/components/upload_form'
import urgeStaff from './urgeStaff'
import { deleteProcedureInstance, obsoleteProcedureInstance, finishProcedureInstance, skipProcedureInstance, transProcedureInstance, failbackApproverProcedureInstance, failbackRequestProcedureInstance, remindProcedureInstance, countersignProcedureInstance, ccProcedureInstance, commentProcedureInstance, agreeProcedureInstance, refuseTargetProcedureInstance, refuseProcedureInstance } from '@/api/approve'
const DefaultRefuseForm = {
  refuse_to_type: undefined,
  refuse_next_type: undefined,
  node_id: '',
  content: ''
}

export default {
  name: 'Action',
  components: {
    linkStaff,
    urgeStaff,
    upload
  },
  props: {
    actions: {
      type: Array,
      default: () => []
    },
    flowInstanceId: {
      type: String,
      default: ''
    },
    flowTplId: {
      type: [Number, String],
      default: ''
    },
    flowTplType: {
      type: Number,
      default: 0
    },
    nodeCandidateId: {
      type: String,
      default: undefined
    },
    extraData: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      // 更多
      showPicker: false,
      allActions: [
        {
          name: '同意',
          value: 'agree',
          fun: this.agree
        },
        {
          name: '不同意',
          value: 'refuse',
          fun: this.refuse
        },
        {
          name: '编辑',
          value: 'edit',
          fun: this.edit
        },
        {
          name: '催办',
          value: 'remind',
          fun: this.handleUrge
        },
        {
          name: '删除',
          value: 'delete',
          fun: this.Delete
        },
        {
          name: '作废',
          value: 'obsolete',
          fun: this.toVoid
        },
        {
          name: '结束',
          value: 'finish',
          fun: this.finish
        },
        {
          name: '跳过',
          value: 'skip',
          fun: this.skip
        },
        {
          name: '转办',
          value: 'trans',
          fun: () => {
            if (this.$refs.transls) {
              this.$refs.transls.reset()
            }
            this.transferLinkModel = {}
            this.transferShow = true
          }
        },
        {
          name: '撤回',
          value: 'launcher_withdraw',
          fun: () => { this.withdrawType = 1; this.withdrawReason = ''; this.withdrawShow = true }
        },
        {
          name: '撤回',
          value: 'approver_withdraw',
          fun: () => { this.withdrawType = 2; this.withdrawReason = ''; this.withdrawShow = true }
        },
        {
          name: '加签',
          value: 'counter_sign',
          fun: () => {
            if (this.$refs.addls) {
              this.$refs.addls.reset()
            }
            this.signLinkModel = {}
            this.signShow = true
          }
        },
        {
          name: '抄送',
          value: 'cc',
          fun: () => {
            this.ccLinkModel = {}
            if (this.$refs.ccls) {
              this.$refs.ccls.reset()
            }
            this.ccShow = true
          }
        },
        {
          name: '评论',
          value: 'comment',
          fun: () => {
            this.commentReason = ''
            this.commentUploadImg = []
            this.commentLinkModel = {}
            if (this.$refs.ls) {
              this.$refs.ls.reset()
            }
            this.commentShow = true
          }
        }
      ],

      // 同意
      agreeShow: false,
      approveReason: '',
      // 评论
      commentShow: false,
      commentReason: '',
      commentUploadImg: [],
      commentLinkModel: {},
      commentLinkOpt: {
        code: 'to_user',
        type: 'FormLinkStaff',
        name: '通知相关人',
        required: true,
        readonly: 0,
        props: { extra: '', permission: '' } },
      // 拒绝
      refuseShow: false,
      refuseForm: JSON.parse(JSON.stringify(DefaultRefuseForm)),
      refuseNodeList: [],
      refuseDisableNodeName: ['开始节点', '提单节点'],
      // 催办
      urgingShow: false,
      urgingReason: '',
      urgingLinkModel: {},
      urgingLinkOpt: {
        code: 'staff_ids',
        type: 'FormLinkStaff',
        name: '催办人',
        required: true,
        readonly: 0,
        props: { extra: '', permission: '' } },
      // 抄送
      ccShow: false,
      ccLinkModel: {},
      ccLinkOpt: {
        code: 'cc_user',
        type: 'FormLinkStaff',
        name: '抄送人',
        required: true,
        readonly: 0,
        props: { extra: '', permission: '' } },
      // 撤回
      withdrawShow: false,
      withdrawReason: '',
      withdrawType: 1, // 提单人撤回 2审批人撤回
      // 转办
      transferShow: false,
      transferLinkModel: {},
      transferLinkOpt: {
        code: 'trans_to',
        type: 'FormLinkStaff',
        name: '转办人',
        required: true,
        readonly: 0,
        props: { extra: '', permission: '' } },
      // 加签
      signShow: false,
      signLinkModel: {},
      signLinkOpt: {
        code: 'candidate_ids',
        type: 'FormLinkStaff',
        name: '加签人',
        required: true,
        readonly: 0,
        props: { extra: '', permission: '' } }
    }
  },
  computed: {
    showActions () {
      return this.allActions.filter(item => {
        // 系统操作类型的模板 type=2   h5 隐藏编辑按钮
        if (item.value === 'edit' && this.flowTplType === 2) {
          return false
        }
        return this.actions.indexOf(item.value) > -1
      })
    },
    moreActions () {
      return this.showActions.slice(4)
    },
    rightAction () {
      return this.showActions.slice(0, 1)[0]
    },
    options () {
      let result = [1, 2, 3]
      if (this.extraData && this.extraData.rejectOptions && this.extraData.rejectOptions.options) {
        result = this.extraData.rejectOptions.options
      }
      return result
    },
    specifiedNodeType () {
      let result = [1, 2]
      if (this.extraData && this.extraData.rejectOptions && this.extraData.rejectOptions.specified_node_type) {
        result = this.extraData.rejectOptions.specified_node_type
      }
      return result
    },
    submitNodeType () {
      let result = [1, 2]
      if (this.extraData && this.extraData.rejectOptions && this.extraData.rejectOptions.submit_node_type) {
        result = this.extraData.rejectOptions.submit_node_type
      }
      return result
    }
  },
  methods: {
    // 撤回（审批人）、拒绝（选择节点）
    // 所有动作：删除、作废、编辑、结束、跳过、转办、撤回（提单人、审批人）、催办、加签、抄送、评论、拒绝（到指定节点、选择节点）、同意

    // 作废
    toVoid () {
      this.$confirm({
        title: '提示',
        message: '确定要作废审批吗？',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        confirmButtonColor: '#BC8D58'
      }).then(() => {
        obsoleteProcedureInstance({
          flow_instance_id: this.flowInstanceId
        }).then(res => {
          if (res.code === 200) {
            this.$toast('作废审批成功')
            this.$router.back()
          } else {
            this.$toast(res.msg || '作废审批失败')
          }
        })
      }).catch(() => {})
    },

    // 撤回
    onWithdrawSubmit () {
      const data = {
        content: this.withdrawReason
      }

      if (this.withdrawType === 2) {
        data.node_candidate_id = this.nodeCandidateId
        failbackApproverProcedureInstance(data).then(res => {
          if (res.code === 200) {
            this.withdrawReason = ''
            this.withdrawShow = false
            this.$toast(`撤回成功！`)
            this.$router.back()
          } else {
            this.$toast(res.msg || '撤回失败')
          }
        })
      } else {
        data.flow_instance_id = this.flowInstanceId
        failbackRequestProcedureInstance(data).then(res => {
          if (res.code === 200) {
            this.withdrawReason = ''
            this.withdrawShow = false
            this.$toast(`撤回成功！`)
            this.$router.back()
          } else {
            this.$toast(res.msg || '撤回失败')
          }
        })
      }
    },

    // 删除
    Delete () {
      this.$confirm({
        title: '提示',
        message: '确定要删除审批吗？',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        confirmButtonColor: '#BC8D58'
      }).then(() => {
        deleteProcedureInstance({
          flow_instance_id: this.flowInstanceId
        }).then(res => {
          if (res.code === 200) {
            this.$toast('删除审批成功')
            this.$router.back()
          } else {
            this.$toast(res.msg || '删除审批失败')
          }
        })
      }).catch(() => {})
    },

    // 结束
    finish () {
      this.$confirm({
        title: '提示',
        message: '确定要结束审批吗？',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        confirmButtonColor: '#BC8D58'
      }).then(() => {
        finishProcedureInstance({
          record_id: this.flowInstanceId
        }).then(res => {
          if (res.code === 200) {
            this.$toast('结束审批成功')
            this.$emit('ok')
          } else {
            this.$toast(res.msg || '结束审批失败')
          }
        })
      }).catch(() => {})
    },

    // 跳过
    skip () {
      this.$confirm({
        title: '提示',
        message: '确定要跳过审批吗？',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        confirmButtonColor: '#BC8D58'
      }).then(() => {
        skipProcedureInstance({
          node_candidate_id: this.nodeCandidateId
        }).then(res => {
          if (res.code === 200) {
            this.$toast('跳过成功')
            this.$emit('ok')
          } else {
            this.$toast(res.msg || '跳过失败')
          }
        })
      }).catch(() => {})
    },

    // 催办
    handleUrge () {
      this.urgingReason = ''
      this.urgingLinkModel = {}
      if (this.$refs.us) {
        this.$refs.us.reset()
      }
      this.urgingShow = true
    },

    // 抄送
    onCCSubmit () {
      console.log(this.ccLinkModel, '抄送人')
      // this.$toast.success('抄送成功')
      ccProcedureInstance({
        cc_user: this.ccLinkModel.cc_user.map(item => `b#${item}`),
        flow_instance_id: this.flowInstanceId
      }).then(res => {
        if (res.code === 200) {
          this.ccShow = false
          this.ccLinkModel = {}
          this.$toast('抄送成功')
          this.$emit('ok')
        } else {
          this.$toast(res.msg || '抄送失败')
        }
      })
    },

    // 评论 - 提交
    onCommentSubmit () {
      console.log(this.commentReason, '评论内容')
      console.log(this.commentUploadImg, '评论图片')
      console.log(this.commentLinkModel, '相关人')
      // this.$toast.success('评论成功')
      const data = {
        flow_instance_id: this.flowInstanceId,
        to_user: this.commentLinkModel.to_user.map(item => `B#${item}`),
        content: this.commentReason
      }
      if (this.commentUploadImg && this.commentUploadImg.length) {
        data.files = this.commentUploadImg.map(item => item.url)
      }

      commentProcedureInstance(data).then(res => {
        if (res.code === 200) {
          this.commentShow = false
          // this.commentReason = ''
          // this.commentUploadImg = []
          // this.commentLinkModel = {}
          this.$toast('评论成功')
          this.$emit('ok')
        } else {
          this.$toast(res.msg || '评论失败')
        }
      })
    },

    // 同意
    agree () {
      this.$emit('validate')
    },
    showAgreeModal () {
      this.approveReason = ''
      this.agreeShow = true
    },

    // 拒绝弹框
    refuse () {
      this.refuseForm = JSON.parse(JSON.stringify(DefaultRefuseForm))
      this.refuseShow = true
      if (!this.refuseNodeList || !this.refuseNodeList.length) {
        this.getRefuseNodeList()
      }
    },

    // 获取拒绝节点
    getRefuseNodeList () {
      refuseTargetProcedureInstance({ node_candidate_id: this.nodeCandidateId }).then(res => {
        if (res.code === 200) {
          const nodeList = res.data.node_list || []
          // 不展示开始节点和提单节点
          this.refuseNodeList = nodeList.filter(item => !this.refuseDisableNodeName.includes(item.name))
        } else {
          // this.$toast(res.msg || '获取拒绝节点失败')
        }
      })
    },

    // 拒绝-提交
    onRefuseSubmit () {
      refuseProcedureInstance({
        node_candidate_id: this.nodeCandidateId,
        ...this.refuseForm
      }).then(res => {
        if (res.code === 200) {
          this.refuseShow = false
          this.$toast('操作成功')
          this.$emit('ok')
        } else {
          this.$toast(res.msg || '操作失败')
        }
      })
    },

    // 拒绝 - 流向节点选择
    refuseNodeSelect (item) {
      this.refuseForm.node_id = item.record_id
    },

    // 同意-提交审批意见
    onAgreeSubmit () {
      console.log(this.approveReason, '同意审批意见')
      const data = {
        node_candidate_id: this.nodeCandidateId,
        content: this.approveReason
      }
      if (this.extraData) {
        data.form_data = this.extraData.form_data
        data.subject = this.extraData.subject
      }
      agreeProcedureInstance(data).then(res => {
        if (res.code === 200) {
          this.agreeShow = false
          this.approveReason = ''
          this.$toast('同意审批成功')
          this.$emit('ok')
        } else {
          this.$toast(res.msg || '同意审批失败')
        }
      })
    },

    // 催办 - 提交
    onUrgingSubmit () {
      console.log(this.urgingReason, '催办内容')
      console.log(this.urgingLinkModel, '催办人')
      // this.$toast.success('催办成功')
      remindProcedureInstance({
        staff_ids: this.urgingLinkModel.staff_ids,
        flow_instance_id: this.flowInstanceId,
        content: this.urgingReason
      }).then(res => {
        if (res.code === 200) {
          this.urgingReason = ''
          this.urgingShow = false
          this.urgingLinkModel = {}
          this.$toast('催办成功')
          this.$emit('ok')
        } else {
          this.$toast(res.msg || '催办失败')
        }
      })
    },

    // 转办 - 提交
    onTransferSubmit () {
      console.log(this.transferLinkModel, '转办人')
      // this.$toast.success('转办成功')
      transProcedureInstance({
        node_candidate_id: this.nodeCandidateId,
        trans_to: this.transferLinkModel.trans_to.map(item => `B#${item}`)[0]
      }).then(res => {
        if (res.code === 200) {
          this.transferShow = false
          this.transferLinkModel = {}
          this.$toast('转办成功')
          this.$emit('ok')
        } else {
          this.$toast(res.msg || '转办失败')
        }
      })
    },

    // 加签 - 提交
    onSignSubmit () {
      console.log(this.signLinkModel, '加签人')
      // this.$toast.success('加签成功')
      countersignProcedureInstance({
        node_candidate_id: this.nodeCandidateId,
        candidate_ids: this.signLinkModel.candidate_ids.map(item => `B#${item}`)
      }).then(res => {
        if (res.code === 200) {
          this.signShow = false
          this.signLinkModel = {}
          this.$toast('加签成功')
          this.$emit('ok')
        } else {
          this.$toast(res.msg || '加签失败')
        }
      })
    },

    // 更多 选择动作
    selectAction (item) {
      item.fun && item.fun()
    },

    // 方法
    confirmPopup (msg, success, fail) {
      this.$confirm({
        title: '提示',
        message: msg,
        confirmButtonColor: '#BC8D58'
      }).then(() => {
        // on confirm
        success()
        console.log('confirm')
      }).catch(() => {
        // on cancel
        fail()
        console.log('cancel')
      })
    },

    // 编辑
    edit () {
      this.$router.push({
        name: 'ApproveEdit',
        query: {
          id: this.flowTplId,
          instanceId: this.flowInstanceId
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .action {
    padding: 16px 20px;
    box-sizing: border-box;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    border-top: 1px solid #EFEFEF;

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

    &-primary {
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
      padding: 12px 16px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-radius: 8px 8px 0 0;
      box-shadow: inset 0px -1px 0px 0px #EFEFEF;

      &-title {
        font-size: 14px;
        color: #999;
        line-height: 20px;
        font-weight: 400;
        font-family: PingFangSC-Medium, PingFang SC;
      }

      &-cancel, &-submit {
        font-size: 15px;
        color: #666;
        line-height: 20px;
        font-weight: 400;
      }

      &-submit {
        color: #BC8D58;
      }
    }

    &-refuse {
      display: flex;
      flex-wrap: wrap;

      &-node {
        min-width: 109px;
        border-radius: 20px;
        background: #F5F5F5;
        padding: 8px 16px;
        box-sizing: border-box;
        font-size: 15px;
        color: #333;
        font-weight: 400;
        line-height: 20px;
        text-align: center;
        margin-right: 10px;
        margin-bottom: 12px;
      }

      &-active {
        color: #BC8D58;
        background: rgba(234, 201, 165, 0.25);
      }
    }
  }
  .textarea {
    height: 334px;
  }
  .refuse-node {
    padding-bottom: 0;
  }
  .link-staff {
    border-top: 1px solid #EFEFEF;
  }

  ::v-deep .van-popup--bottom {
    border-radius: 8px 8px 0 0;
    &.minH {
      min-height: 300px;
    }
  }
  ::v-deep .van-field {
    flex-direction: column;
  }
  ::v-deep .van-field::after {
    border: 0;
  }
  ::v-deep .van-field__label {
    width: 100%;
    margin-bottom: 12px;
  }
  ::v-deep .refuse-node .van-field__body {
    width: calc(100vw - 16px);
  }
  ::v-deep .refuse-node .van-field__label {
    margin-bottom: 16px;
  }
  ::v-deep .link-staff .van-field {
    flex-direction: row;
  }
  ::v-deep .link-staff .van-field__label {
    margin-bottom: 0;
    width: auto;
  }
  ::v-deep .van-field--min-height {
      &.overSize {
        .van-field__word-num {
          color: red;
        }
      }
    }
</style>
