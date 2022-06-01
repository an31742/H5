<!--
  功能：待确认--确认报价按钮
  作者：Roy Li
  邮箱：lirong@aiforward.com
  时间：2021年12月20日 14:24:45
-->
<template>
  <div :class="{'qy-flex-between-center': allowButlerConfirm === 2}">
    <span v-if="allowButlerConfirm !== 2">请等待用户确认报价</span>
    <van-button
      v-if="allowButlerConfirm === 2"
      round
      plain
      color="#E1AA6C"
      class="footer-button"
      type="primary"
      @click="putOrderStatus(5)"
    >拒绝报价</van-button>
    <van-button
      v-if="allowButlerConfirm === 2"
      round
      color="#E1AA6C"
      class="footer-button"
      type="warning"
      @click="putOrderStatus(4)"
    >确认报价</van-button>
  </div>
</template>

<script>
import { Dialog, Toast } from 'vant'
import { homeReclaim } from '@/utils/const.js'
import { putOrderStatus } from '@/api/getHomeReclaim'
export default {
  // 组件名称
  name: 'OrderFooter',
  // 组件参数 接收来自父组件的数据
  props: {
    orderId: {
      type: Number,
      default: 0
    },
    allowButlerConfirm: {
      type: Number,
      default: 0
    }
  },
  methods: {
    putOrderStatus (action) {
      if (action === 5) {
        Dialog.confirm({
          title: '提示',
          message: '您要拒绝此报价吗？',
          confirmButtonColor: '#E1AA6C'
        }).then(() => {
          this.sendRequest(action)
        }).catch(() => {
        })
      } else {
        Dialog.confirm({
          title: '提示',
          message: '您要确认此报价吗？',
          confirmButtonColor: '#E1AA6C'
        }).then(() => {
          this.sendRequest(action)
        }).catch(() => {})
      }
    },
    sendRequest (action) {
      putOrderStatus({
        action,
        order_id: Number(this.orderId)
      }).then((res) => {
        if (res.code === 200) {
          Toast.success(action === 5 ? '拒绝成功' : '确认成功')
          this.$store.dispatch('getHomeReclaim/setUpdateListData', {
            pageType: homeReclaim.reclaim,
            orderId: this.orderId,
            deleteItem: true
          })
          this.$emit('refreshDetail')
        }
      }).catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
  .qy-flex-between-center {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    button {
      width: 165px;
    }
  }
</style>
