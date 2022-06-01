<!--
  功能：取件弹窗
  作者：Roy Li
  邮箱：lirong@aiforward.com
  时间：2021年12月08日 15:30:37
-->
<template>
  <van-dialog
    v-model="show"
    title="请输入取件码"
    show-cancel-button
    confirm-button-color="#E1AA6C"
    @confirm="setPickUp"
  >
    <template #default>
      <van-field
        @click.stop
        v-model="code"
        class="pick-up--field"
        type="number"
      />
    </template>
  </van-dialog>
</template>

<script>
import { Dialog } from 'vant'
import { confrimPickUp } from 'views/getHomeReclaim/Components/utils.js'
import { homeReclaim } from '@/utils/const'
export default {
  // 组件名称
  name: 'PickUpDialog',
  // 组件参数 接收来自父组件的数据
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    orderId: {
      type: Number,
      default: 0
    }
  },
  // 局部注册的组件
  components: {
    [Dialog.Component.name]: Dialog.Component
  },
  // 组件状态值
  data () {
    return {
      show: this.showDialog,
      code: ''
    }
  },
  watch: {
    showDialog (val) {
      if (val !== this.show) this.show = val
    },
    show (val) {
      this.$emit('updateShow', val)
      if (!val) this.code = ''
    }
  },
  // 组件方法
  methods: {
    setPickUp () {
      confrimPickUp(this.orderId, this.code).then(() => {
        // 更新操作
        this.$store.dispatch('getHomeReclaim/setUpdateListData', {
          pageType: homeReclaim.reclaim,
          orderId: this.orderId,
          deleteItem: true
        })
        this.$emit('refreshDetail')
      }).catch((e) => {})
    }
  }
}
</script>

<style lang="scss" scoped>
  .pick-up--field {
    width: auto;
    margin: 25px 25px 38px 25px;
    background-color: #F7F8FA;
  }
</style>
