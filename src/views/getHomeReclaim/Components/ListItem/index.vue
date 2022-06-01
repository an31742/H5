<!--
  功能：估价列表项与订单列表项
  作者：Roy Li
  邮箱：lirong@aiforward.com
  时间：2021年11月19日 14:19:10
-->
<template>
  <van-row
    type="flex"
    align="center"
    class="list-item bdb"
    @click="toDetail"
  >
    <van-col class="list-item-img">
      <van-image
        class="icon"
        fit="cover"
        :src="item.images[0]"
      />
      <!-- 品类 -->
      <van-tag
        round
        class="list-item-img__tag"
      >{{ goodsType }}</van-tag>
    </van-col>
    <van-col class="list-item-info">
      <!-- 估价单列表不显示取件地址 -->
      <van-row
        class="info__title ellipsis"
        :class="{ 'info__title--warp': !item.desc }"
      >{{ item.title }}</van-row>
      <van-row
        v-if="item.desc"
        class="ellipsis"
        v-html="item.desc"
      ></van-row>
      <van-row v-if="item.type === homeReclaim.ORDER_END" class="ellipsis">{{ dayjs(item.complete_time).format('YYYY-MM-DD') }}</van-row>
      <van-row v-else class="ellipsis">{{ dayjs(item.create_time).format('YYYY-MM-DD') }}</van-row>
    </van-col>
    <van-col v-if="footerComponentName" class="list-item-footer">
      <component :is="footerComponentName" v-bind="propsData" @refreshDetail="refreshDetail"></component>
    </van-col>
  </van-row>
</template>

<script>
import dayjs from 'dayjs'
import { homeReclaim } from '@/utils/const.js'
export default {
  // 组件名称
  name: 'ListItem',
  // 组件参数 接收来自父组件的数据
  props: {
    item: {
      type: Object,
      default: () => ({}),
      required: true
    },
    pageType: {
      type: String,
      default: ''
    }
  },
  // 局部注册的组件
  components: {
    EvaluateAmount: () => import('./footers/EvaluateAmount.vue'),
    EvaluateStatus: () => import('./footers/EvaluateStatus.vue'),
    ToBeConfirmed: () => import('./footers/ToBeConfirmed.vue'),
    OrderEnd: () => import('./footers/OrderEnd.vue'),
    OrderCancel: () => import('./footers/OrderCancel.vue'),
    SetPickUp: () => import('./footers/SetPickUp.vue'),
    SetAmount: () => import('./footers/SetAmount.vue'),
    ConfirmPay: () => import('./footers/ConfirmPay.vue'),
    ConfirmEnd: () => import('./footers/ConfirmEnd.vue'),
    SubmitOrder: () => import('./footers/SubmitOrder.vue')
  },
  // 组件状态值
  data () {
    return {
      homeReclaim
    }
  },
  // 计算属性
  computed: {
    goodsType () {
      const types = {
        1: '3C',
        2: '家电'
      }
      return types[this.item.goods_category] || ''
    },
    footerComponentName () {
      const names = {
        [homeReclaim.evaluation]: {
          [homeReclaim.STATUS_NO_EVALUATE]: 'EvaluateStatus',
          [homeReclaim.STATUS_EVALUATE]: 'EvaluateAmount',
          [homeReclaim.EVALUATION_STATUS_END]: 'EvaluateAmount',
          [homeReclaim.EVALUATION_STATUS_CANCEL]: 'EvaluateAmount'
        },
        [homeReclaim.reclaim]: {
          [homeReclaim.STATUS_NO_PICK_UP]: 'SetPickUp',
          [homeReclaim.IN_QUOTATION]: 'SetAmount',
          [homeReclaim.TO_BE_CONFIRMED]: 'ToBeConfirmed',
          [homeReclaim.TO_BE_PAID]: 'ConfirmPay',
          [homeReclaim.ORDER_END]: 'ConfirmEnd',
          [homeReclaim.ORDER_CANCEL]: 'ConfirmEnd'
        },
        [homeReclaim.valet]: {
          [homeReclaim.STAFF_STATUS_NO_EVALUATE]: 'EvaluateStatus',
          [homeReclaim.STAFF_STATUS_EVALUATE]: 'SubmitOrder',
          [homeReclaim.STAFF_EVALUATION_STATUS_END]: 'EvaluateAmount',
          [homeReclaim.STAFF_EVALUATION_STATUS_CANCEL]: 'EvaluateAmount'
        }
      }
      return names[this.pageType][this.item.type]
    },
    propsData () {
      const attrs = {
        'EvaluateAmount': {
          amount: this.item.type === homeReclaim.TO_BE_PAID ? this.item.dealAmount : this.item.appraisalText
        },
        'ToBeConfirmed': {
          amount: this.item.dealAmount
        },
        'OrderCancel': {
          cancelType: this.item.cancel_channel
        },
        'SetPickUp': {
          orderId: this.item.order_id
        },
        'SetAmount': {
          orderId: this.item.order_id
        },
        'ConfirmPay': {
          orderId: this.item.order_id
        },
        'ConfirmEnd': {
          type: this.item.type,
          orderId: this.item.order_id,
          settlementStatus: this.item.settlement_status || 0
        }
      }
      return attrs[this.footerComponentName] ?? {}
    }
  },
  // 组件方法
  methods: {
    dayjs,
    toDetail () {
      this.$router.push({
        name: 'ReclaimOrderDetail',
        query: {
          type: this.item.type,
          order_id: this.item.order_id
        }
      })
    },
    refreshDetail (data = {}) {
      // 更新当前数据的状态
      const keys = Object.keys(data)
      keys.forEach(i => {
        this.item[i] = data[i]
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .ellipsis {
    @include ell()
  }
  .list-item {
    margin: 0px 16px;
    padding: 15px 0;
    white-space: nowrap;
    height: 94px;
    box-sizing: border-box;
    box-shadow: none !important;
    &-img {
      width: 64px;
      height: 64px;
      border-radius: 6px;
      overflow: hidden;
      margin-right: 8px;
      position: relative;
      .icon {
        width: 100%;
        height: 100%;
      }
      &__tag {
        display: block;
        width: 32px;
        padding-right: 0;
        padding-left: 0;
        text-align: center;
        position: absolute;
        right: 5px;
        bottom: 5px;
        background-color: rgba(0, 0, 0, 0.4);
        color: #fff;
      }
    }
    &-info {
      flex: 1;
      font-size: 12px;
      color: #999;
      overflow: hidden;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .info__title {
        font-size: 15px;
        color: #333;
        &--warp {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          white-space: pre-wrap;
        }
      }
    }
    &-footer {
      flex: none;
      height: 100%;
      padding-left: 10px;
      padding-right: 2px;
    }
  }
  .list-item:last-child {
    border-bottom: none;
  }
</style>
