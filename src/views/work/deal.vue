<template>
  <div class="fw-container flex-column">
    <!--表单-->
    <van-form
      ref="form"
      class="expand"
      validate-first
      scroll-to-error
      :show-error-message="false"
      @submit="handleSubmit"
    >
      <!--动态表单-->
      <fc ref="fc" :model="formModel" :options="options" :extData="flowInstance" />
    </van-form>

    <!--提交按钮-->
    <div class="pf-form" style="position: relative;">
      <div class="btn btn-save">
        <van-button
          v-if="backBtn"
          type="default"
          round
          class="btn-item"
          @click="handleBack"
        >
          {{ backBtn.name }}
        </van-button>

        <van-button
          v-if="nextBtn"
          type="primary"
          round
          class="btn-item confirm"
          color="linear-gradient(45deg, #F2D5A5 0%, #E1AA6C 100%)"
          @click="$refs.form.submit()"
        >
          {{ nextBtn.name }}
        </van-button>
      </div>
    </div>
  </div>
</template>

<script>
import { wfeFlowInstanceTodoInfo, wfeFlowInstanceHandleBack, costAdd, wfeFlowInstanceHandleNext, contractGet, updateHandleState, deleteHandleState } from '@/api/wfe'
import fc from '../formComponents/index'
import { string2obj } from '@/utils/index'

export default {
  name: 'WfeInstanceLaunch',
  components: { fc },
  data () {
    return {
      options: [],
      formModel: {},
      btns: [],
      orderDetail: {},
      orderId: this.$route.query.id || '',
      flow_instance: {},
      biz_code: '',
      cost_detail_id: '',
      isDeal: true
    }
  },
  // 如果是领取物料跳转过来的就回显
  beforeRouteEnter (to, from, next) {
    next((vm) => {
      // 通过 `vm` 访问组件实例,将值传入fromPath
      vm.fromPath = from.path
    })
    // console.log('from.path', from)
    if (from.name === 'ReceiveAdd') {
      window.beforeRoute = true
      next((vm) => {
      // 通过 `vm` 访问组件实例,将值传入fromPath
        vm.fromPath = from.path
      })
    }
  },

  computed: {
    // 回退按钮
    backBtn () {
      return this.btns.find(item => item.act === 'BACK')
    },
    // 流转按钮
    nextBtn () {
      return this.btns.find(item => item.act === 'NEXT')
    }
  },

  created () {
    if (window.beforeRoute === true) {
      this.formModel = this.$store.getters.formModel
      window.beforeRoute = false
    }

    if (!this.orderId) {
      this.$toast('参数错误')
      this.$router.back()
      return
    }
    this.flowInstance = this.$route.params.flowInstance
    this.getOrderDetail()
  },
  methods: {
    // 获取合同
    getContract () {
      contractGet({
        flow_instance_id: this.flow_instance.record_id
      }).then(res => {
        console.log(6767, res)
        this.options.forEach(e => {
          if (e.code === 'srv_prop_is_cost') {
            e.contractNo = res.data.contractNo
            e.chargeType = res.data.chargeType
          }
        })
        console.log('code', this.options)
      })
    },
    // 获取节点表单
    getOrderDetail () {
      wfeFlowInstanceTodoInfo({
        node_instance_id: this.orderId
      }).then(res => {
        if (res.code === 200) {
          this.orderDetail = res.data || {}
          const fi = this.orderDetail['flow_instance'] || {}
          const launcher = fi.launcher.startsWith('C#') ? fi.launcher.replace('C#', '') : ''
          this.flow_instance = fi
          console.log(res)
          this.biz_code = this.orderDetail['biz_code'] || ''
          this.cost_detail_id = this.orderDetail['cost_detail_id'] || ''
          const list = string2obj(this.orderDetail['biz_form']) || []
          console.log('list', list)
          this.options = list.map(item => {
            item.code = item.code.toLowerCase()
            item.user_id = launcher
            item.group_id = fi['group_id']
            return item
          })
          console.log(23333, this.options)

          this.btns = string2obj(res.data.node_property.ACT_DEAL) || []
          this.getContract()
          return
        }
        this.$toast('获取数据失败')
      })
    },

    // 回退
    handleBack () {
      wfeFlowInstanceHandleBack({
        node_instance_id: this.orderId,
        target_node_id: this.backBtn.node
      }).then(res => {
        if (res.code === 200) {
          this.$toast('提交成功')
          this.$router.back()
          return
        }
        this.$toast(res.msg || '提交失败')
      })
    },
    getRelationships (arr1, arr2) {
      const arr = [...arr1, ...arr2]
      console.log(arr)
      arr.forEach(e => {
        console.log(e)
        if (e.type === 1) {
          e.material_id = e.id
        }
        if (e.type === 2) {
          e.service_item_id = e.id
        }
        // e.material_id = e.id
      })
      return arr
    },
    // 生成有偿工单明细
    async addCost (item) {
      const data = {
        flow_instance_id: this.flow_instance.record_id,
        service_price: this.formModel[item.code + '_service_fee'],
        material_price: this.formModel[item.code + '_material_fee'],
        amount: this.formModel[item.code + '_amount'],
        relationships: this.getRelationships(this.formModel[item.code + '_service'] || [], this.formModel[item.code + '_material'] || [])
      }
      await costAdd(data).then(res => {
        if (res.code === 200) {
          this.options.forEach(item => {
            item.readonly = 1
          })
          this.isDeal = false
          console.log('做了一些操作', this.isDeal)
          this.next()
        } else {
          this.$toast(res.msg)
        }
      })
    },
    // 更新有偿工单状态
    async updateState () {
      const data = { id: this.cost_detail_id || 0,
        flow_instance_id: this.flow_instance.record_id }
      await updateHandleState(data).then(res => {
        if (res.code !== 200) {
          this.isDeal = false
          this.$toast(res.msg)
        } else {
          this.$toast(res.msg)
        }
      })
    },
    // 流转
    async handleSubmit () {
      console.log('--------------------------------')
      console.log(this.formModel)
      console.log('--------------------------------')
      const payOrder = this.options.find(e => e.code === 'srv_prop_is_cost') || {}
      // 在“处理”节点改变有偿工单的状态
      if (this.biz_code === 'NODE_CODE_HANDLE' && this.cost_detail_id) {
        await this.updateState()
      } else if (this.biz_code === 'NODE_CODE_HANDLE' && payOrder.code) {
        await this.addCost(payOrder)
        await this.updateState()
      }
      if (!this.isDeal) {
        return
      }
      // 判断是否有图片在上传中
      let comps = this.findChildren(this.$children)
      comps = comps.filter(item => item.$options.name === 'UploadComponent' && item.loading)
      if (comps && comps.length) {
        this.$toast('请等待图片上传完成')
        return
      }

      // 有偿工单的特殊操作：如果存在是否收费控件，要在有偿工单生成后再继续走工单的节点流程，否则中断,如果不存在是否收费控件，那么继续走工单流程
      if (payOrder.code && payOrder.code === 'srv_prop_is_cost') {
        // 处理完当前节点后，“是否收费”这个表单一律不许编辑
        if (this.formModel[payOrder.code] === 1) {
          // 需要生成明细,明细生成成功后，接着走流程，不成功不走
          this.addCost(payOrder)
        } else if (this.formModel[payOrder.code] === 2 && this.cost_detail_id) {
          // 软删除
          deleteHandleState({ id: this.cost_detail_id }).then(res => {
            console.log(res)
            this.next()
          })
        } else {
          this.next()
        }
      } else {
        this.next()
      }
    },
    // 正常流转工单的流程
    async next () {
      // 传到接口，方便查看详情的时候直接取字段 和 表单项顺序问题
      const ffl = this.options.map(item => {
        return { name: item.name, code: item.code, readonly: item.readonly, type: item.type, props: item.props || {} }
      })
      this.formModel.frontFormLabels = ffl

      const params = {
        node_instance_id: this.orderId,
        input: JSON.stringify(this.formModel)
      }
      const res = await wfeFlowInstanceHandleNext(params)
      if (res.code === 200) {
        this.$toast('提交成功')
        this.$router.back()
        return
      }
      this.$toast(res.msg || '提交失败')
    }

  }
}
</script>

<style scoped lang="scss">
  .expand {
    margin-top: 12px;
  }
  .fw-btm-wrap {
    padding: 16px 36px;
  }
  .btn-save {
    padding: 16px 0;
    text-align: center;
    .btn-item {
      font-size: 18px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #E1AA6C;
      line-height: 25px;
      border-radius: 20px;
      border: 1px solid;
      padding: 7px 0;
      width: 141px;
      display: inline-block;
      &.confirm {
        background: linear-gradient(45deg, #F2D5A5 0%, #E1AA6C 100%);
        color: #FFFFFF;
        margin-left: 18px;
      }
    }

    ::v-deep .van-button__text {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }

  ::v-deep .van-field {
    margin-bottom: 12px;
    .van-cell__title.van-field__label {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      color: #333333;
      line-height: 24px;
    }
    .van-field__control {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      color: #999999;
      line-height: 20px;
    }
    .van-field__right-icon {
      line-height: 20px;
      font-size: 0;
    }
    .van-field__right-icon .svg-icon {
      vertical-align: -6px;
    }
  }
</style>
