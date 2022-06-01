<!--
  功能：确认结算 or 已结算 or 已完成
  作者：Roy Li
  邮箱：lirong@aiforward.com
  时间：2021年12月07日 19:35:58
-->
<template>
  <div class="container" @click.stop>
    <div v-if="!pageType && settlementStatus > 0" class="code">
      <!-- 确认结算 -->
      <van-button
        v-if="settlementStatus === 1"
        plain
        class="pick-up--button"
        type="primary"
        color="#E1AA6C"
        @click.stop="confirmSettlement(orderId)"
      >确认结算</van-button>
      <van-tag
        v-if="settlementStatus === 2"
        type="primary"
        size="large"
        color="#ECF5FF"
        text-color="#46A1FF"
        style="font-size: 12px;"
      >{{ type === homeReclaim.ORDER_END ? '已完成' : '已结算' }}</van-tag>
    </div>
    <div v-if="pageType === 'info'" class="info-button">
      <van-button
        v-if="!hideBackButton"
        plain
        color="#E1AA6C"
        class="qy-flex-1 footer-button"
        :disabled="goodsStatus === 4"
        @click.stop="confirmCancel(orderId)"
      >物品已取回</van-button>
      <van-button
        color="#E1AA6C"
        class="qy-flex-1"
        :disabled="settlementStatus === 2"
        @click.stop="confirmSettlement(orderId)"
      >确认结算</van-button>
    </div>
  </div>
</template>

<script>
import { homeReclaim } from 'utils/const'
import { confirmSettlement, confirmBack } from 'views/getHomeReclaim/Components/utils.js'
export default {
  // 组件名称
  name: 'ConfirmEnd',
  // 组件参数 接收来自父组件的数据
  props: {
    pageType: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: ''
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
    hideBackButton: {
      type: Boolean,
      default: false
    }
  },
  // 组件状态值
  data () {
    return {
      homeReclaim
    }
  },
  // 组件方法
  methods: {
    confirmSettlement (orderId) {
      confirmSettlement(orderId).then(() => {
        this.$emit('refreshDetail', {
          settlement_status: 2
        })
      })
    },
    confirmCancel (orderId) {
      confirmBack(orderId).then(() => {
        this.$emit('refreshDetail', {
          recycler_pickup_status: 2
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  .code {
    width: 60px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .pick-up--button {
      width: 60px;
      height: 23px;
      border-radius: 2px;
      font-size: 12px;
    }
  }
  .info-button {
    display: flex;
    align-items: center;
    font-size: 16px;
    font-weight: 600;
  }
  .footer-button {
    margin-right: 15px;
  }
  .qy-flex-1 {
    flex: 1;
    border-radius: 6px;
  }
}
</style>
