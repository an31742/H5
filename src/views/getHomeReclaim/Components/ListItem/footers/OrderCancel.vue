<!--
  功能：回收订单--已取消
  作者：Roy Li
  邮箱：lirong@aiforward.com
  时间：2021年11月23日 14:54:14
-->
<template>
  <div class="tag" v-if="cancelText">
    {{ cancelText }}
  </div>
</template>

<script>
export default {
  // 组件名称
  name: 'OrderCancel',
  // 组件参数 接收来自父组件的数据
  props: {
    cancelType: {
      type: Number,
      default: 0
    }
  },
  computed: {
    cancelText () {
      const statusText = {
        1: '拒绝报价',
        2: '物业取消'
      }
      return statusText[this.cancelType]
    }
  }
}
</script>

<style lang="scss" scoped>
  .tag {
    height: 100%;
    display: flex;
    align-items: center;
    font-size: 12px;
    color: #FF4D4F;
  }
</style>
