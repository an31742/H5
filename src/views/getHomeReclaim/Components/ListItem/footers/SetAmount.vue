<!--
  功能：去报价
  作者：Roy Li
  邮箱：lirong@aiforward.com
  时间：2021年12月06日 17:26:02
-->
<template>
  <div class="container" @click.stop>
    <div v-if="!pageType" class="code">
      <van-button
        plain
        class="pick-up-button"
        type="primary"
        color="#E1AA6C"
        @click.stop="editAmount"
      >去报价</van-button>
    </div>
    <van-button
      v-if="pageType === 'info'"
      color="#E1AA6C"
      class="pick-up-button--info"
      type="warning"
      @click.stop="editAmount"
    >填写报价</van-button>
  </div>
</template>

<script>
export default {
  // 组件名称
  name: 'SetAmount',
  // 组件参数 接收来自父组件的数据
  props: {
    orderId: {
      type: Number,
      default: 0
    },
    pageType: {
      type: String,
      default: '' // info: 详情页
    }
  },
  // 组件方法
  methods: {
    editAmount () {
      this.$router.push({
        name: 'SetRealAmount',
        query: {
          order_id: this.orderId
        }
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
      .pick-up-button {
        width: 60px;
        height: 23px;
        border-radius: 2px;
        font-size: 12px;
      }
    }
    .pick-up-button--info {
      width: 100%;
      border-radius: 6px;
    }
  }
</style>
