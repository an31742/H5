<!--
  功能：确认支付
  作者：Roy Li
  邮箱：lirong@aiforward.com
  时间：2021年12月07日 18:58:34
-->
<template>
  <div class="container" @click.stop>
    <div v-if="!pageType" class="code">
      <van-button
        plain
        class="pick-up--button"
        type="primary"
        color="#E1AA6C"
        @click.stop="confirmPay"
      >确认支付</van-button>
    </div>
    <van-button
      v-if="pageType === 'info'"
      color="#E1AA6C"
      class="pick-up-button--info"
      type="warning"
      @click.stop="confirmPay"
    >确认支付完成</van-button>
  </div>
</template>

<script>
import { dialogConfirmPay } from 'views/getHomeReclaim/Components/utils.js'
import { homeReclaim } from '@/utils/const'
export default {
  // 组件名称
  name: 'ConfirmPay',
  // 组件参数 接收来自父组件的数据
  props: {
    orderId: {
      type: Number,
      default: 0
    },
    pageType: {
      type: String,
      default: ''
    }
  },
  // 组件方法
  methods: {
    confirmPay () {
      dialogConfirmPay(this.orderId).then(() => {
        this.$store.dispatch('getHomeReclaim/setUpdateListData', {
          pageType: homeReclaim.reclaim,
          orderId: this.orderId,
          deleteItem: true
        })
        this.$emit('refreshDetail')
      }).catch(() => {})
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
    .pick-up-button--info {
      width: 100%;
      border-radius: 6px;
      font-size: 16px;
      font-weight: 600;
    }
  }
</style>
