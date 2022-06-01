<template>
  <div class="edit">
    <!-- 申请信息 -->
    <div class="edit-main">
      <!--审批编号-->
      <p class="edit-item">
        <span class="edit-name">审批编号</span>
        <span class="edit-text">{{ approveCode }}</span>
      </p>
      <!--提单人-->
      <p class="edit-item">
        <span class="edit-name">提单人</span>
        <span class="edit-text">{{ userData.name }}</span>
      </p>
      <!--所在节点-->
      <p class="edit-item">
        <span class="edit-name">所在节点</span>
        <span class="edit-text">{{ userData.dep_name || '' }}</span>
      </p>
      <!--申请时间-->
      <p class="edit-item">
        <span class="edit-name">申请时间</span>
        <span class="edit-text">{{ new Date() | timeFilter }}</span>
      </p>
    </div>
    <!-- 表单 start -->
    <template v-if="formObj.form && formObj.form.length > 0">
      <van-form
        ref="form"
        validate-first
        scroll-to-error
        @submit="handleSubmit"
        @failed="onFailed"
      >
        <fc
          ref="fc"
          :model="formModel"
          :options="widgetForm"
          :launcherId="userData.id"
        />
      </van-form>
    </template>

    <!-- 抄送 -->
    <div class="edit-cc">
      <p class="edit-name">抄送</p>
      <van-grid :column-num="5" :border="false">
        <van-grid-item v-for="(item, index) in approveCCList" :key="index">
          <van-image round fit="cover" width="41" height="41" :src="item.staff_avatar || item.avatar || require('@/assets/image/user.png')" />
          <span class="edit-cc-name van-ellipsis">{{ item.staff_name || item.name || '' }}</span>
        </van-grid-item>
        <van-grid-item @click="selectUser">
          <van-image round fit="cover" width="41" height="41" :src="require('@/assets/image/approve/add.png')" />
          <span class="edit-cc-name">添加</span>
        </van-grid-item>
      </van-grid>
    </div>
    <!-- 添加抄送人弹框 -->
    <van-popup
      v-model="addCCShow"
      :get-container="getBodyContainer"
      :close-on-click-overlay="false"
      position="bottom"
      class="fake-popup form-component"
    >
      <SelectStaff
        ref="ss"
        class="link-staff"
        searchTip="请输入员工姓名进行搜索"
        :defaultSelected="defaultCCSelected"
        @cancel="cancelSelected"
        @confirm="onAddCCSubmit"
      ></SelectStaff>
    </van-popup>

    <!-- 流程 start -->
    <div v-if="trackData && trackData.length" class="edit-step">
      <p class="title">流程</p>
      <van-steps
        class="bdn"
        active-color="#BC8D58"
        inactive-color="#E1AA6C"
        direction="vertical"
        active="0"
      >
        <van-step v-for="(item, idx) in trackData" :key="idx">
          <template #active-icon>
            <img class="active-icon" :src="require('@/assets/image/step-icon.png')" />
          </template>
          <template #inactive-icon>
            <img class="active-icon" :src="require('@/assets/image/step-icon.png')" />
          </template>

          <!--节点名称-->
          <div class="appeal-action">
            <a class="title dark">{{ item.name || '' }}</a>
          </div>

          <!--处理人-->
          <div v-if="item.candidate" class="appeal-desc">
            {{ (item.candidate || []).map(item => item['staff_name']).join('    ') }}
          </div>
        </van-step>
      </van-steps>
    </div>

    <!-- 操作栏 -->
    <div v-if="isEdit" class="action approveAction">
      <!--左侧按钮-->
      <van-button
        v-for="(item, index) in showActions"
        :key="index"
        type="default"
        round
        size="small"
        class="action-button"
        @click="item.fun()"
      >
        {{ item.name }}
      </van-button>
      <!-- 分割线 -->
      <span class="action-line"></span>
      <!--右侧按钮-->
      <van-button
        type="primary"
        round
        size="small"
        class="action-primary"
        color="linear-gradient(45deg, #F2D5A5 0%, #E1AA6C 100%)"
        @click="onSubmitApprove"
      >
        提交
      </van-button>
    </div>
    <div v-else class="edit-button fixed-bottom">
      <van-button
        type="default"
        round
        class="edit-button-default"
        @click="onPreserveApprove"
      >
        保存
      </van-button>
      <van-button
        type="primary"
        round
        class="edit-button-primary"
        color="linear-gradient(45deg, #F2D5A5 0%, #E1AA6C 100%)"
        @click="onSubmitApprove"
      >
        提交
      </van-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { string2obj } from '@/utils'
import { changeTitle } from 'utils/index'
import fc from '@/views/formApprove/index'
import SelectStaff from '@/views/formApprove/common/SelectStaff'
import { getProcedureTemplateDetail, getProcedureInstanceDiagram, getProcedureInstanceNo, submitProcedureInstance, updateProcedureInstance, getProcedureItemDetail, deleteProcedureInstance } from '@/api/approve'
import formExtLogic from './formExtLogic/index'
import moment from 'moment'
import { setApplyLaunderItem } from './util'
export default {
  name: 'ApproveEdit',
  components: {
    SelectStaff,
    fc
  },
  filters: {
    depFilter (list = []) {
      return list.map(item => item.name).join(',')
    }
  },
  data () {
    return {
      tplId: Number(this.$route.query.id),
      instanceId: this.$route.query.instanceId,
      isEdit: this.$route.query.edit + '' === '1',
      showActions: [
        {
          name: '删除',
          fun: this.onDeleteItem
        },
        {
          name: '保存',
          fun: this.onPreserveApprove
        }
      ],
      action: '',
      trackData: [],
      firstNode: {},
      formObj: {
        form: []
      },
      formModel: {},
      approveCode: '',
      approveCCList: [],
      // 抄送人弹框
      addCCShow: false,
      tempArr: [],
      defaultCCLinkOpt: [],
      defaultCCSelected: [],
      templateCode: '',
      rules: {},
      widgetForm: []
    }
  },
  computed: {
    ...mapGetters([
      'userData'
    ])
  },
  created () {
    if (!this.tplId) {
      this.$toast('参数错误')
      return
    }

    this.getDiagram()
    // 新增的时候获取code
    if (!this.instanceId) {
      this.getApproveCode()
    }
  },
  methods: {
    // 获取审批编号
    getApproveCode () {
      getProcedureInstanceNo().then(res => {
        if (res.code === 200) {
          this.approveCode = res.data.num || ''
        } else {
          this.$toast(res.msg || '获取信息失败')
        }
      })
    },

    // 获取模板详情
    getTplDetail () {
      const fetchList = [getProcedureTemplateDetail({ id: this.tplId })]
      // 编辑时获取详情
      if (this.instanceId) {
        fetchList.push(getProcedureItemDetail({ flow_instance_id: this.instanceId }))
      }

      Promise.all(fetchList).then(resArr => {
        const resTemplate = resArr[0]
        const resDetail = resArr[1]
        resDetail && this.dealDetail(resDetail)
        this.dealTemplate(resTemplate)

        // 保存以后使用frontFormLabels 构建页面
        if (this.formModel.frontFormLabels) {
          this.widgetForm = this.formModel.frontFormLabels
        } else {
          this.widgetForm = this.formObj.form
        }

        this.dealExtLogic()
      }).catch(_ => {
        this.loading = false
      })
    },
    dealTemplate (res) {
      if (res.code === 200) {
        this.formObj = res.data
        // 模板的类型,根据模板类型加载 扩展业务逻辑
        this.templateCode = res.data.tpl_code
        try {
          const arr = JSON.parse(res.data.form)
          if (Array.isArray(arr)) {
            this.formObj.form = this.formatVisible(arr)
          } else {
            this.formObj.form = []
          }
          setApplyLaunderItem(
            {
              allowReplace: this.formObj.allow_replace,
              launcherScope: this.formObj.launcher_scope,
              templateId: this.formObj.id,
              applyLauncher: this.formObj.apply_launcher_id,
              visibility: 2
            }
            ,
            this.formObj.form
          )
        } catch (e) {
          this.formObj.form = []
        }
        changeTitle(res.data['tpl_group'] && res.data['tpl_group'].name || res.data.name || '新建申请')
      } else {
        this.$toast(res.msg || '获取信息失败')
      }
    },
    dealDetail (res) {
      if (res.code === 200) {
        const data = res.data || {}
        const flowInstance = data['flow_instance'] || []
        this.approveCode = flowInstance.no || ''
        this.approveCCList = res.data['cc_list'] || []
        this.defaultCCLinkOpt = this.approveCCList.map(item => item['staff_id'] || item.id)
        this.defaultCCSelected = this.copyArray(this.defaultCCLinkOpt)
        this.formModel = flowInstance['form_data'] ? string2obj(flowInstance['form_data']) : null
      } else {
        this.$toast(res.msg || '获取信息失败')
      }
    },
    // 处理特殊模板业务扩展逻辑
    dealExtLogic () {
      // 初试化 默认值 保证watch 函数有效
      for (var item of this.formObj.form) {
        if (!this.formModel.hasOwnProperty(item.code)) {
          this.$set(this.formModel, item.code, null)
          this.$set(this.rules, item.code, [])
        }
      }
      // 处理模板业务扩展逻辑
      if (formExtLogic[this.templateCode]) {
        formExtLogic[this.templateCode](this, this.formModel, this.formObj, this.rules)
      }
    },
    // 获取模板轨迹
    getDiagram () {
      getProcedureInstanceDiagram({ flow_tpl_id: this.tplId }).then(res => {
        if (res.code === 200) {
          this.trackData = res.data['diagram'] || []
          this.firstNode = res.data['first_node'] || {}
          this.approveCCList = this.firstNode['fixed_cc'] || []
          this.defaultCCLinkOpt = this.approveCCList.map(item => item['staff_id'] || item.id)
          this.defaultCCSelected = this.copyArray(this.defaultCCLinkOpt)
          this.getTplDetail()
        } else {
          this.$toast(res.msg || '获取信息失败')
        }
      })
    },

    // 是否可见、是否可编辑
    formatVisible (arr) {
      const formVisibility = this.firstNode['form_visibility'] || {}
      arr.map(item => {
        item.visibility = formVisibility[item.code] && formVisibility[item.code].visibility || 1
        return item
      })

      return arr
    },

    // 选择抄送人
    selectUser () {
      this.tempArr = this.copyArray(this.defaultCCSelected)
      this.addCCShow = true
      this.$nextTick(() => {
        this.$refs.ss.show()
      })
    },

    // 选择抄送人
    onAddCCSubmit (val, list) {
      this.addCCShow = false
      this.approveCCList = list
      this.defaultCCSelected = list.map(item => item['staff_id'] || item.id)
    },

    // 取消选择
    cancelSelected (val, list) {
      this.addCCShow = false
      this.defaultCCSelected = this.tempArr
    },

    // 提交申请
    handleSubmit () {
      this.formModel.frontFormLabels = this.formObj.form.map(item => {
        return { name: item.name, code: item.code, type: item.type, props: item.props || {}, required: item.required }
      })

      let api = submitProcedureInstance
      const params = {
        subject: this.getSubject(this.formModel),
        form: this.formModel,
        submit: this.action === 'submit',
        cc: this.approveCCList.map(item => 'B#' + (item['staff_id'] || item['id'])),
        apply_launcher: this.formModel.applyLauncher || this.userData.id
      }
      // 新增
      if (!this.instanceId) {
        params['flow_tpl_id'] = this.tplId
        params.no = this.approveCode
      } else { // 编辑
        api = updateProcedureInstance
        params['record_id'] = this.instanceId
      }

      this.doRequest(api, params, this.action === 'submit' ? '提交' : '保存', !this.instanceId)
    },

    // 获取subject数据
    getSubject (form) {
      const values = []
      this.formObj.subject.map(item => {
        if (form[`${item}_desc`] || form[item]) {
          values.push(form[`${item}_desc`] || form[item])
        } else {
          const desc = this.getExtraInfo(item)
          if (desc) {
            values.push(desc)
          }
        }
      })
      return values.join('-')
    },

    getExtraInfo (item) {
      const extraMap = {
        requestPerson: this.userData.name,
        requestTime: moment().format('YYYYMMDD'),
        templateName: this.formObj.name
      }
      return extraMap[item] || ''
    },

    // 保存申请
    onPreserveApprove () {
      this.action = 'save'
      this.$refs.form && this.$refs.form.submit()
    },

    // 删除
    onDeleteItem () {
      this.$confirm({
        title: '提示',
        message: '确定要删除审批吗？',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        confirmButtonColor: '#BC8D58'
      }).then(() => {
        deleteProcedureInstance({
          flow_instance_id: this.instanceId
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

    // 提交申请
    onSubmitApprove () {
      this.action = 'submit'
      this.$refs.form && this.$refs.form.submit()
    },

    // 调用接口
    doRequest (api, data, cop, back) {
      api(data).then(res => {
        if (res.code === 200) {
          this.$toast(`${cop}成功！`)
          this.$router.back()
        } else {
          this.$toast(res.msg || `${cop}失败`)
        }
      })
    },
    onFailed (errorInfo) {
      console.log('failed', errorInfo)
    }
  }
}
</script>

<style lang="scss" scoped>
  .fake-popup {
    height: 90%;width: 100%;font-family: PingFangSC-Regular, PingFang SC;
    position: fixed;
    left: 0;
    overflow: hidden;
    bottom: 0;
    border-radius: 0 !important;
  }

  .edit {
    background: #F6F8FA;
    min-height: calc(100vh - 64px);
    min-height: calc(100vh - 64px - constant(safe-area-inset-bottom));
    min-height: calc(100vh - 64px - env(safe-area-inset-bottom));
    padding-bottom: 72px;

    &-main {
      background: #fff;
      margin-bottom: 12px;
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

    &-step {
      background: #fff;
      margin: 12px 0;
      padding: 16px 6px 6px 6px;
      .title {
        font-size: 14px;
        line-height: 20px;
        text-indent: 10px;
      }
      .appeal-action {
        font-size: 15px;
        font-weight: 500;
        color: #333333;
        line-height: 21px;
      }
      .appeal-desc {
        color: #BC8D58;
        margin: 8px 0 0;
      }
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

    &-button {
      padding: 16px 37px;
      box-sizing: border-box;
      background: #fff;
      display: flex;
      justify-content: space-between;
      z-index: 99;
      border-top: 1px solid #EFEFEF;

      &-default, &-primary {
        min-width: 141px;
        height: 40px;
        font-size: 17px;
        font-weight: 500;
        font-family: PingFangSC-Medium, PingFang SC;
      }

      &-default {
        border-color: #E1AA6C;
        color: #E1AA6C;
      }
    }
  }

  .action {
    padding: 16px 20px;
    box-sizing: border-box;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    border-top: 1px solid #EFEFEF;
    z-index: 99;

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
