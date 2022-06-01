<!--
  功能：回收订单__取件码
  作者：Roy Li
  邮箱：lirong@aiforward.com
  时间：2021年11月19日 17:39:37
-->
<template>
  <div v-if="pickUpCode" class="code">
    <div class="code--text">取件码</div>
    <div class="code--code">{{ pickUpCode }}</div>
  </div>
</template>

<script>
export default {
  // 组件参数 接收来自父组件的数据
  props: {
    pickUpCode: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
  .code {
    width: 64px;
    height: 64px;
    background: #FAFBFC;
    border-radius: 3px;
    border: 0px solid rgba(151, 151, 151, 0.16);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .code--text {
      font-size: 15px;
      color: #8C8C8C;
      line-height: 21px;
    }
    .code--code {
      font-size: 21px;
      font-weight: 700;
      color: #000;
      line-height: 30px;
    }
  }
</style>
