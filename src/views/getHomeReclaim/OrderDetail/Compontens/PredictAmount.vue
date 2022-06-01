<!--
  功能：详情页__估价信息
  作者：Roy Li
  邮箱：lirong@aiforward.com
  时间：2021年11月24日 16:07:39
-->
<template>
  <div>
    <!-- 估价 -->
    <div v-if="showPredictAmount" class="predict-amount">
      <div class="predict-amount__line qy-flex-center">
        <div class="predict-amount__title">估价</div>
        <div
          v-if="showTopAmount"
          class="predict-amount__price"
          :class="{'predict-amount__price--danger': showTopAmountDanger}"
        >{{ amount }}</div>
      </div>
      <div class="predict-amount__line predict-amount__line--spacing qy-flex-between-center">
        <div
          class="predict-amount__desc"
          :class="{'predict-amount__desc--weaken' : !showBottomAmount}"
        >{{ predictAmountDesc }}</div>
        <div
          v-if="showBottomAmount"
          class="predict-amount__price predict-amount__price--danger"
        >{{ amount }}</div>
      </div>
    </div>
    <!-- 回收商报价 -->
    <div v-if="dealAmount" class="predict-amount">
      <div class="predict-amount__line qy-flex-center">
        <div class="predict-amount__title">回收商报价</div>
        <div
          class="predict-amount__price"
          :class="{'predict-amount__price--danger': true}"
        >{{ dealAmount }}</div>
        <div class="qy-flex-1 qy-flex-end-center">
          <span v-if="isToBePaid" class="predict-amount__status">已确认</span>
          <order-end v-if="isOrderEnd" />
          <span
            v-if="orderCancelText"
            class="predict-amount__status predict-amount__status--danger"
          >{{ orderCancelText }}</span>
        </div>
      </div>
      <div v-if="showToBeConfirmedTime" class="predict-amount__line predict-amount__line--spacing predict-amount__desc predict-amount__desc--weaken">
        请在<span class="predict-amount__desc__time">{{ confirmLastTime }}</span>前确认报价，超时未确认，回收商将重新报价
      </div>
      <div v-if="!showPredictAmount" class="predict-amount__line predict-amount__line--spacing predict-amount__desc predict-amount__desc--weaken predict-amount__desc--border">
        物业估价&emsp;{{ amount }}
      </div>
    </div>
  </div>
</template>

<script>
import { homeReclaim } from '@/utils/const.js'
export default {
  // 组件名称
  name: 'PredictAmount',
  // 组件参数 接收来自父组件的数据
  props: {
    type: {
      type: String,
      default: ''
    },
    // 估价
    amount: {
      type: String,
      default: ''
    },
    // 回收商报价
    dealAmount: {
      type: String,
      default: ''
    },
    confirmLastTime: {
      type: String,
      default: ''
    },
    // 订单动作
    action: {
      type: Number,
      default: 0
    }
  },
  // 局部注册的组件
  components: {
    OrderEnd: () => import('views/getHomeReclaim/Components/ListItem/footers/OrderEnd.vue')
  },
  // 组件状态值
  data () {
    return {
      homeReclaim
    }
  },
  // 计算属性
  computed: {
    showPredictAmount () {
      return [homeReclaim.TO_BE_PAID, homeReclaim.ORDER_END].indexOf(this.type) === -1
    },
    showTopAmount () {
      return this.showPredictAmount && [homeReclaim.STATUS_NO_EVALUATE, homeReclaim.STATUS_EVALUATE].indexOf(this.type) === -1
    },
    showTopAmountDanger () {
      return this.showTopAmount && [homeReclaim.TO_BE_CONFIRMED].indexOf(this.type) === -1
    },
    showBottomAmount () {
      return [homeReclaim.STATUS_NO_EVALUATE, homeReclaim.STATUS_EVALUATE, homeReclaim.EVALUATION_STATUS_END].indexOf(this.type) > -1
    },
    predictAmountDesc () {
      return this.showBottomAmount ? '你为此订单的估价为' : '请确认估价，您的估价为'
    },
    showToBeConfirmedTime () {
      return homeReclaim.TO_BE_CONFIRMED === this.type
    },
    isToBePaid () {
      return homeReclaim.TO_BE_PAID === this.type
    },
    isOrderEnd () {
      return homeReclaim.ORDER_END === this.type
    },
    orderCancelText () {
      const statusText = {
        1: '拒绝报价',
        2: '物业取消'
      }
      return homeReclaim.ORDER_CANCEL === this.type && statusText[this.action]
    }
  }
}
</script>

<style lang="scss" scoped>
  $danger-color: #FF4D4F;
  @mixin amount-card () {
    background-color: #fff;
    margin-top: 8px;
    padding: 12px 15px;
    color: #333;
  }
  .predict-amount {
    @include amount-card();
    &__line {
      line-height: 21px;
    }
    &__line--spacing {
      margin-top: 18px;
    }
    &__title {
      margin-right: 12px;
      font-size: 17px;
      font-weight: 700;
    }
    &__desc {
      font-size: 15px;
      &__time {
        color: #E1AA6C;
      }
    }
    &__desc--weaken {
      color: #999;
    }
    &__desc--border {
      margin-top: 11px;
      padding-top: 10px;
      border-top: 1px solid rgba(151, 151, 151, .1);
    }
    &__price {
      font-size: 18px;
      font-weight: 700;
    }
    &__price--danger {
      color: $danger-color;
    }
    &__status {
      font-size: 12px;
      color: #1A7AFF;
    }
    &__status--danger {
      color: $danger-color;
    }
    .qy-flex-center {
      display: flex;
      align-items: center;
    }
    .qy-flex-between-center {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .qy-flex-1 {
      flex: 1
    }
    .qy-flex-end-center {
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
  }
</style>
