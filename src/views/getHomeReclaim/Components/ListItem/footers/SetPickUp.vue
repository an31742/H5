<!--
  功能：去取件
  作者：Roy Li
  邮箱：lirong@aiforward.com
  时间：2021年12月06日 17:26:02
-->
<template>
  <div class="container" @click.stop>
    <van-button
      v-if="pageType === 'info'"
      color="#E1AA6C"
      class="footer-button"
      type="warning"
      @click="editPickUpCode"
    >取件</van-button>
    <div v-else class="code" @click.stop>
      <van-button
        plain
        class="pick-up--button"
        type="primary"
        color="#E1AA6C"
        @click="editPickUpCode"
      >去取件</van-button>
    </div>
    <pick-up-dialog style="color: #333;" :showDialog="showDialog" :orderId="orderId" @updateShow="updateShow" @refreshDetail="refreshDetail" />
  </div>
</template>

<script>
export default {
  // 组件名称
  name: 'SetPickUp',
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
  // 局部注册的组件
  components: {
    PickUpDialog: () => import('./PickUpDialog.vue')
  },
  // 组件状态值
  data () {
    return {
      showDialog: false
    }
  },
  // 组件方法
  methods: {
    // 填取件码
    editPickUpCode () {
      this.showDialog = true
    },
    updateShow (val) {
      this.showDialog = val
    },
    refreshDetail () {
      this.$emit('refreshDetail')
    }
  }
}
</script>

<style lang="scss" scoped>
  .container {
    width: 100%;
    height: 100%;
  }
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
  .footer-button {
    width: 100%;
    border-radius: 6px;
    font-size: 16px;
    font-weight: 600;
  }
</style>
