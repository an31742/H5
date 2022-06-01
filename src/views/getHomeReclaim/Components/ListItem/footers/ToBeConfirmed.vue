<!--
  功能：回收订单--待确认
  作者：Roy Li
  邮箱：lirong@aiforward.com
  时间：2021年11月23日 11:24:23
-->
<template>
  <div v-if="amount">
    <div class="amount">{{ amount }}</div>
    <div class="amount__text">面客报价</div>
  </div>
</template>

<script>
export default {
  // 组件名称
  name: 'ToBeConfirmed',
  // 组件参数 接收来自父组件的数据
  props: {
    amount: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
  .amount {
    font-size: 18px;
    font-weight: 700;
    color: #FF4D4F;
    text-align: right;
  }
  .amount__text {
    font-size: 12px;
    color: #999;
    text-align: right;
  }
</style>
