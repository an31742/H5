<!--
  功能：估价单__已估价金额
  作者：Roy Li
  邮箱：lirong@aiforward.com
  时间：2021年11月19日 15:00:18
-->
<template>
  <div
    v-if="amount"
    class="evaluate-amount"
  >
    {{ amount }}
  </div>
</template>
<script>
export default {
  props: {
    amount: {
      type: String,
      default: ''
    }
  }
}
</script>
<style lang="scss" scoped>
  .evaluate-amount {
    height: 100%;
    text-align: bottom;
    font-size: 18px;
    font-weight: 700;
    color: #FF4D4F;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }
</style>
