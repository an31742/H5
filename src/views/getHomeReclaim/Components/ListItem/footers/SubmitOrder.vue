<!--
  功能：提交订单
  作者：Roy Li
  邮箱：lirong@aiforward.com
  时间：2021年12月08日 18:51:55
-->
<template>
  <div class="code">
    <van-button
      plain
      class="pick-up--button"
      type="primary"
      color="#E1AA6C"
    >提交订单</van-button>
  </div>
</template>

<script>
export default {
  // 组件名称
  name: 'SubmitOrder'
}
</script>

<style lang="scss" scoped>
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
</style>
