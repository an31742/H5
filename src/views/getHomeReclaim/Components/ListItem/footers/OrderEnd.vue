<!--
  功能：回收订单--已完成
  作者：Roy Li
  邮箱：lirong@aiforward.com
  时间：2021年11月23日 14:25:35
-->
<template>
  <div class="tag">
    <van-icon class="tag__icon" name="checked" />
    <span class="tag__text">已结算</span>
  </div>
</template>

<script>
export default {
  // 组件名称
  name: 'OrderEnd'
}
</script>

<style lang="scss" scoped>
  .tag {
    height: 100%;
    display: flex;
    align-items: center;
    color: #87D155;
    &__icon {
      font-size: 15px;
    }
    &__text {
      font-size: 12px;
      color: #87D155;
      margin-left: 3px;
    }
  }
</style>
