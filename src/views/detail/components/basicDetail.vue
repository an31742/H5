<template>
  <div>
    <div class="work-detail" :style="{paddingBottom: workDetail.cost_detail && workDetail.cost_detail.amount ? '60px' : ''}">
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

        <!--提单人-->
        <template v-if="instanceLauncher && launcherType==='C'">
          <p class="work-detail-row">
            <span class="work-detail-label">提单人：</span>
            <span class="work-detail-desc">
              {{ flowInstance.launcher_name }}
            </span>
            <span v-if="!isAnonymous" class="work-detail-yellow" @click="$refs.df.handleDial([{name:instanceLauncher.user_mobile}])">
              {{ instanceLauncher.user_mobile }}
            </span>
          </p>
          <!--身份-->
          <p v-if="instanceLauncher.user_role" class="work-detail-row">
            <span class="work-detail-label">身份：</span>
            <span v-if="isAnonymous" class="work-detail-label">-</span>
            <span v-else class="work-detail-desc">
              {{ instanceLauncher.user_role | userRole }}
            </span>
          </p>
        </template>
        <!--服务名称-->
        <p v-if="flowInstance['biz_service_name']" class="work-detail-row">
          <span class="work-detail-label">服务名称：</span>
          <span class="work-detail-desc">
            {{ flowInstance['biz_service_name'] }}/{{ flowInstance['biz_subservice_name'] }}
          </span>
          <a v-if="todoNodeInstance.biz_node_code === 'NODE_CODE_DISPATCH'" class="edit-basic" @click="showAndGetSubservice">编辑</a>
        </p>
        <template v-if="instanceLauncher && launcherType==='C'">
          <!--房屋-->
          <p v-if="instanceLauncher.room_path" class="work-detail-row">
            <span class="work-detail-label">房屋：</span>
            <span class="work-detail-desc">
              {{ instanceLauncher.room_path }}
            </span>
          </p>
          <!--客户等级-->
          <p v-if="instanceLauncher.care_level" class="work-detail-row">
            <span class="work-detail-label">客户等级：</span>
            <span v-if="isAnonymous" class="work-detail-desc">-</span>
            <span v-else class="work-detail-desc">
              {{ instanceLauncher.care_level | careLevel }}
            </span>
          </p>
          <!--是否残障-->
          <p class="work-detail-row">
            <span class="work-detail-label">是否残障：</span>
            <span v-if="isAnonymous" class="work-detail-desc">-</span>
            <template v-else>
              <span v-if="getDisabledLevel(instanceLauncher.disabled_level)" class="work-detail-desc">
                {{ getDisabledLevel(instanceLauncher.disabled_level) }}/{{ getDisableCategory(instanceLauncher.disabled_category) }}
              </span>
              <span v-else class="work-detail-desc">否</span>
            </template>
          </p>
          <!--家属残障-->
          <p v-if="instanceLauncher.disabled_family_member && instanceLauncher.disabled_family_member.length && !isAnonymous" class="work-detail-row work-detail-disabled">
            <span class="work-detail-label">家属残障：</span>
            <span class="work-detail-disabled-content">
              <span v-for="(item, index) in instanceLauncher.disabled_family_member" :key="index" class="work-detail-desc">
                {{ familyMember(item) }} <span v-if="index !== instanceLauncher.disabled_family_member.length - 1">;</span>
              </span>
            </span>
          </p>
        </template>

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
        <!--录单人 只有代客录单的时候才展示录单人-->
        <p v-if="instanceStaff && flowInstance.source===2" class="work-detail-row">
          <span class="work-detail-label">录单人：</span>
          <span class="work-detail-desc">
            {{ instanceStaff.staff_name }}
            <span @click="$refs.df.handleDial([{name:instanceStaff.staff_mobile}])">
              {{ instanceStaff.staff_mobile }}
            </span>
          </span>
        </p>
        <!--工单来源-->
        <p class="work-detail-row">
          <span class="work-detail-label">工单来源：</span>
          <span class="work-detail-desc">
            {{ flowInstance.source | instanceSource }}
          </span>
        </p>
      </div>

      <!--详细信息-->
      <div v-if="formData" class="work-detail-content" style="padding-bottom: 65px;">
        <p class="work-detail-row work-mgb16">
          <span class="work-detail-title">详细信息</span>
        </p>
        <!--提单信息-->
        <detail ref="det" :formData="formData"></detail>
      </div>
      <!--费用信息-->
      <div v-if="workDetail.cost_detail && workDetail.cost_detail.cost_detail_id" class="work-detail-content" style="margin-bottom: 80px;">
        <p class="work-detail-row work-mgb16">
          <span class="work-detail-title">费用信息</span>
        </p>
        <!--服务费用：-->
        <p class="work-detail-row">
          <span class="work-detail-label">服务费用：</span>
          <span class="work-detail-desc">
            {{ centToYuan(workDetail.cost_detail.service_price) }}
            <span style="color: #BC8D58;" @click="openService">详情</span>
          </span>
        </p>
        <!--材料费用：-->
        <p class="work-detail-row">
          <span class="work-detail-label">材料费用：</span>
          <span class="work-detail-desc">
            {{ centToYuan(workDetail.cost_detail.material_price) }}
            <span style="color: #BC8D58;" @click="openMaterial">详情</span>
          </span>
        </p>
        <!--合同编号：-->
        <p class="work-detail-row" v-if="workDetail.cost_detail.contract_number">
          <span class="work-detail-label">合同编号：</span>
          <span class="work-detail-desc contact" >
            {{ workDetail.cost_detail.contract_number + `(${getPayManner( workDetail.cost_detail.pay_manner)})` }}
          </span>
        </p>
        <!--支付状态：-->
        <p class="work-detail-row">
          <span class="work-detail-label">支付状态：</span>
          <span class="work-detail-desc">
            {{ getAppealPayStatus(workDetail.cost_detail.pay_state) || '--' }}
          </span>
        </p>
        <!--支付时间：-->
        <p class="work-detail-row" v-if="workDetail.cost_detail.pay_state && workDetail.cost_detail.pay_state !== 1">
          <span class="work-detail-label">支付时间：</span>
          <span class="work-detail-desc">
            {{ ( workDetail.cost_detail.pay_time && dayjs(workDetail.cost_detail.pay_time).format('YYYY-MM-DD HH:mm:ss')) || '无' }}
          </span>
        </p>
      </div>

      <!--拨打电话-->
      <dial-phone ref="df" />

      <!-- 修改服务子类弹框 -->
      <van-popup
        v-model="showSubCategories"
        style="width:90%;z-index: 3001;overflow:hidden"
        @closed="cancelOverlay"
      >
        <div class="sub-title">修改服务子类</div>
        <div class="sub-list">
          <div
            v-for="(item) in subCategories"
            :key="item.id"
            class="sub-item"
            :class="{active: item.record_id===flowInstance.biz_subservice_id}"
            @click="subCategoryClick(item)"
          >
            {{ item.name }}
          </div>
        </div>
        <div class="van-hairline--top van-dialog__footer">
          <button class="van-button van-button--default van-button--large van-dialog__cancel" @click="cancelPopup">
            <div class="van-button__content"><span class="van-button__text">取消</span>
            </div>
          </button>
          <button class="van-button van-button--default van-button--large van-dialog__confirm van-hairline--left submit-btn" @click="updateSubservice">
            <div class="van-button__content">
              <span class="van-button__text">确认</span>
            </div>
          </button>
        </div>
      </van-popup>
    </div>
    <SelectedMaterial ref="selectedM" :data="material" :readonly="true"/>
    <SelectedService ref="selectedS" :data="service" :readonly="true" />

  </div>
</template>

<script>
import dialPhone from '@/views/components/dialPhone'
import detail from '@/views/formComponents/detail'
import { getItemByValue, centToYuan } from '@/utils/index'
import { updateFlowInstance, getSubservice, relationshipGet } from '@/api/wfe'
import SelectedMaterial from '@/views/cost/selectedMaterial'
import SelectedService from '@/views/cost/selectedService'
import dayjs from 'dayjs'

export default {
  name: 'BasicDetail',
  components: {
    dialPhone,
    detail,
    SelectedMaterial,
    SelectedService
  },
  props: {
    flowInstance: {
      type: Object,
      default: () => {}
    },
    todoNodeInstance: {
      type: Object,
      default: () => {}
    },
    formData: {
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
      dayjs,
      showSubCategories: false,
      subCategories: [],
      service: [],
      material: []
    }
  },
  watch: {
    'orderId' (val) {
      this.getDeviceTaskDetail()
    }
  },
  computed: {
    isAnonymous () {
      return this.flowInstance.is_anonymous === 1
    },
    // 录单类型
    launcherType () {
      if (this.workDetail && this.workDetail.launcher) {
        return this.workDetail.launcher.launcher_type
      }

      return ''
    },
    // 客户信息
    instanceLauncher () {
      if (this.workDetail && this.workDetail.launcher) {
        return this.workDetail.launcher.user
      }

      return null
    },
    // 录单人
    instanceStaff () {
      // 只代客录单的时候展示录单人
      if (this.flowInstance.source !== 2) {
        return null
      }

      return {
        staff_name: this.flowInstance.creator_name || '',
        staff_mobile: this.flowInstance.creator_mobile || ''
      }
    }
  },
  created () {
    console.log(this.doneInstances)
  },
  methods: {
    centToYuan,
    openService () {
      const params = {
        cost_detail_id: this.workDetail.cost_detail.cost_detail_id,
        type: 2
      }
      relationshipGet(params).then(res => {
        console.log(res)
        if (res.code === 200) {
          this.service = res.data.list || []
          this.$refs.selectedS.show()
        }
      })
    },
    openMaterial () {
      const params = {
        cost_detail_id: this.workDetail.cost_detail.cost_detail_id,
        type: 1
      }
      relationshipGet(params).then(res => {
        console.log(res)
        if (res.code === 200) {
          this.material = res.data.list || []
          this.$refs.selectedM.show()
        }
      })
    },
    cancelPopup () {
      this.showSubCategories = false
    },
    cancelOverlay () {
      this.$emit('changeZIndex', 3000)
    },
    subCategoryClick (item) {
      this.$set(this.flowInstance, `biz_subservice_id`, item.record_id)
    },
    getColumns () {
      const options = []
      return options
    },
    showAndGetSubservice () {
      // 修改父组件盒子层级
      this.$emit('changeZIndex', 1)
      const params = {
        biz_service_id: this.flowInstance.biz_service_id
      }
      getSubservice(params).then((res) => {
        if (res.data.length && res.code === 200) {
          this.subCategories = res.data || []
        } else {
          this.$message.error(res.msg)
        }
      })
      this.showSubCategories = true
    },
    updateSubservice () {
      if (!this.subCategories.length) {
        this.showSubCategories = false
        return
      }
      const params = {
        biz_sub_service_id: this.flowInstance.biz_subservice_id,
        flow_instance_id: this.flowInstance.record_id
      }
      updateFlowInstance(params).then((res) => {
        this.showSubCategories = false
        if (res.code === 200) {
          const bizSubserviceName = (this.subCategories.length && this.subCategories.find(e => e.record_id === this.flowInstance.biz_subservice_id).name) || this.flowInstance.biz_subservice_name
          this.$set(this.flowInstance, 'biz_subservice_name', bizSubserviceName)
          this.$toast('编辑成功')
        } else {
          this.$toast(res.msg)
        }
      })
    },
    // 右上角状态显示
    getStatus (item) {
      // 处理中、挂起中展示节点名称，其他的展示状态
      if ([1, 2].indexOf(item.status) > -1) {
        return this.tdNode['biz_node_name'] || ''
      }

      return getItemByValue(this.appConfig ? this.appConfig.WFE_FLOW_INSTANCE_STATUS : [], item.status) || ''
    },

    // 残障等级
    getDisabledLevel (level) {
      return level ? getItemByValue(this.appConfig.USER_V2_DISABLED_LEVEL_LIST, level) : ''
    },

    // 残障部位
    getDisableCategory (level) {
      return level ? getItemByValue(this.appConfig.USER_V2_DISABLED_CATEGORY_LIST, level) : ''
    },

    // 家属残障数据处理
    familyMember (val) {
      return `${val.user_name}：${this.getDisabledLevel(val.disabled_level)}/${this.getDisableCategory(val.disabled_category)}`
    }
  }
}
</script>

<style scoped lang="scss">
.work-detail {
  position: relative;
  z-index: 2001;
}
.van-overlay{
  z-index: 3000 !important;
}
.submit-btn{
  color: #fff;
    background: linear-gradient(
45deg
, rgb(242, 213, 165) 0%, rgb(225, 170, 108) 100%);
    border: none;
    width: 105%;
}
.sub-title {
  padding-top: 0.8rem;
  text-align: center;
  font-weight: 600;
  overflow: hidden;
}
.sub-list {
  width: 100%;
  padding: 30px 0 30px 14px;
  display: flex;
  flex-wrap: wrap;
  &::after{
    content: '';
    flex-grow: 1;
  }
}
  .sub-item {
    display: inline-block;
    margin-bottom: 0.32rem;
    font-size: 0.4rem;
    color: #333333;
    line-height: 0.56rem;
    padding: 0.21333rem 0.45333rem;
    background: #fff;
    border-radius: 0.53333rem;
    border: 1px solid #e6e7e8;
    margin:0 10px 10px 0;
  }
  .active {
    background: #F9EEE2;
    color: #BC8D58;
    border: 1px solid #F9EEE2;
  }
  .edit-basic{
    color: #bc8d58;
    margin-left:30px
  }
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

  .contact {
    word-wrap:break-word; word-break:break-all;overflow: hidden;
      width:260px;
  }
</style>
