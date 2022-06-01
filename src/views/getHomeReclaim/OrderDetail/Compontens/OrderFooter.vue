<!--
  功能：回收单__底部按钮或状态提示
  作者：Roy Li
  邮箱：lirong@aiforward.com
  时间：2021年11月26日 17:09:57
-->
<template>
  <div>
    <div class="fixed-bottom footer">
      <span v-if="footerText" v-html="footerText"></span>
      <!-- 待取件 -->
      <template v-if="this.type === homeReclaim.STATUS_NO_PICK_UP">
        <div class="cancel-button" @click="cancelOrder">取消订单</div>
        <div class="qy-flex-1">
          <set-pick-up pageType="info" :orderId="orderId" @refreshDetail="updatePage" />
        </div>
      </template>
      <!-- 待报价 -->
      <template v-if="this.type === homeReclaim.IN_QUOTATION">
        <set-amount :orderId="orderId" pageType="info" />
      </template>
      <!-- 待确认 -->
      <template v-if="this.type === homeReclaim.TO_BE_CONFIRMED">
        <confirmed-amount
          :orderId="orderId"
          :allowButlerConfirm="allowButlerConfirm"
          pageType="info"
          @refreshDetail="updatePage"
        />
      </template>
      <!-- 待支付 -->
      <template v-if="this.type === homeReclaim.TO_BE_PAID">
        <confirm-pay :orderId="orderId" pageType="info" @refreshDetail="updatePage" />
      </template>
      <!-- 已取消、已完成 -->
      <template v-if="this.type === homeReclaim.ORDER_CANCEL || this.type === homeReclaim.ORDER_END">
        <confirm-end
          :orderId="orderId"
          pageType="info"
          :settlementStatus="settlementStatus"
          :goodsStatus="goodsStatus"
          :hideBackButton="this.type === homeReclaim.ORDER_END"
          @refreshDetail="updatePage"
        />
      </template>
    </div>
  </div>
</template>

<script>
import { Dialog, Toast } from 'vant'
import { homeReclaim } from '@/utils/const.js'
import { putOrderStatus } from '@/api/getHomeReclaim'
export default {
  // 组件名称
  name: 'OrderFooter',
  components: {
    PickUpDialog: () => import('views/getHomeReclaim/Components/ListItem/footers/PickUpDialog.vue'),
    SetAmount: () => import('views/getHomeReclaim/Components/ListItem/footers/SetAmount.vue'),
    ConfirmPay: () => import('views/getHomeReclaim/Components/ListItem/footers/ConfirmPay.vue'),
    ConfirmEnd: () => import('views/getHomeReclaim/Components/ListItem/footers/ConfirmEnd.vue'),
    SetPickUp: () => import('views/getHomeReclaim/Components/ListItem/footers/SetPickUp.vue'),
    ConfirmedAmount: () => import('views/getHomeReclaim/OrderDetail/Compontens/ConfirmedAmount.vue')
  },
  // 组件参数 接收来自父组件的数据
  props: {
    type: {
      type: String,
      default: ''
    },
    buttomText: {
      type: String,
      default: ''
    },
    dealAmount: {
      type: String,
      default: ''
    },
    cancelChannel: {
      type: Number,
      default: 0
    },
    orderId: {
      type: Number,
      default: 0
    },
    settlementStatus: {
      type: Number,
      default: 0
    },
    goodsStatus: {
      type: Number,
      default: 0
    },
    allowButlerConfirm: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      homeReclaim,
      showDialog: false
    }
  },
  // 计算属性
  computed: {
    cancelChannelText () {
      const texts = {
        2: '<span style="color: #999;">物业取消订单</span>',
        1: '<span style="color: #999;">您拒绝了回收商的报价</span>'
      }
      return texts[this.cancelChannel]
    },
    footerText () {
      const texts = {
        [homeReclaim.STAFF_STATUS_NO_EVALUATE]: '请耐心等待报价',
        [homeReclaim.STAFF_EVALUATION_STATUS_END]: '此物品已提交估价单',
        [homeReclaim.EVALUATION_STATUS_END]: '此物品已填写估价',
        [homeReclaim.EVALUATION_STATUS_CANCEL]: '此估价单已取消',
        [homeReclaim.STATUS_EVALUATE]: '您已填写此物品估价',
        [homeReclaim.STAFF_EVALUATION_STATUS_CANCEL]: '此估价单已取消'
      }
      return this.buttomText || texts[this.type]
    }
  },
  methods: {
    updatePage () {
      this.$emit('refreshDetail')
    },
    cancelOrder () {
      Dialog.confirm({
        title: '提示',
        message: '确定取消订单吗',
        confirmButtonColor: '#E1AA6C'
      }).then(() => {
        return this.sendRequest(10)
      }).then((res) => {
        if (res.code === 200) {
          Toast.success('取消成功')
          this.$emit('refreshDetail')
        } else {
          Toast.fail('取消失败')
        }
      }).catch(() => {
        Toast.fail('取消失败')
      })
    },
    sendRequest (action) {
      return putOrderStatus({
        action,
        order_id: Number(this.orderId)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .footer {
    padding: 10px 16px;
    width: 100%;
    height: 64px;
    background: #fff;
    font-size: 17px;
    color: #1A7AFF;
    display: flex;
    justify-content: center;
    align-items: center;
    &-button {
      border-radius: 6px;
      font-size: 16px;
      font-weight: 600;
    }
    .cancel-button {
      flex: none;
      height: 100%;
      display: flex;
      align-items: center;
      margin-right: 27px;
      font-size: 16px;
      font-weight: 600;
      color: #CDCDCD;
    }
  }
  .qy-flex-1 {
    flex: 1;
  }
  .qy-flex-between-center {
    justify-content: space-between;
    align-items: center;
  }
</style>
