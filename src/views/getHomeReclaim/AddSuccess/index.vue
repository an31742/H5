<template>
  <div class="add-success">
    <van-icon
      class="icon"
      name="checked"
      size="44"
      color="#5bd343"
    />
    <div class="title">提交成功</div>
    <div v-if="desc" class="desc">{{ desc || '您已成功提供估价单，请耐心等待回收商估价' }}</div>
    <div v-if="isReclaim" class="desc reclaim-desc">{{ `${countDown}S后返回个人中心` }}</div>
    <van-button
      round
      plain
      block
      color="#E1AA6C"
      class="button"
      @click="jumpPath"
    >
      {{ `${buttonText}${type === 'evaluation' ? `&nbsp;${countDown}S` : ''}` }}
    </van-button>
  </div>
</template>

<script>
import { homeReclaim } from 'utils/const'
const configs = {
  [homeReclaim.evaluation]: {
    desc: '您已成功提交估价单，请耐心等待回收商估价',
    countDown: 3,
    buttonText: '返回上一页'
  },
  [homeReclaim.reclaim]: {
    desc: '您已成功提交估价单，请耐心等待回收商估价',
    countDown: 5,
    buttonText: '查看订单'
  }
}

export default {
  name: 'AddSuccess',
  components: {
  },
  data () {
    return {
      type: this.$route.query.type,
      orderId: this.$route.query.order_id,
      countDown: configs[this.$route.query.type].countDown,
      timer: null
    }
  },
  computed: {
    desc () {
      return configs[this.type] && configs[this.type].desc || ''
    },
    buttonText () {
      return configs[this.type] && configs[this.type].buttonText || ''
    },
    isReclaim () {
      return this.type === homeReclaim.reclaim
    }
  },
  destroyed () {
    this.timer && clearInterval(this.timer)
  },
  mounted () {
    this.start()
  },
  methods: {
    // 倒计时
    start () {
      this.timer = setInterval(() => {
        if (!this.countDown) {
          clearInterval(this.timer)
          // 倒计时到了自动返回进入时的入口
          this.type === homeReclaim.evaluation && this.$router.go(-1)
          this.type === homeReclaim.reclaim && this.$router.go(-2)
          return
        }
        --this.countDown
      }, 1000)
    },
    // 跳转页面
    jumpPath () {
      this.type === homeReclaim.evaluation && this.$router.go(-1)
      this.type === homeReclaim.reclaim && this.$router.replace({
        name: 'ReclaimOrderDetail',
        query: {
          type: homeReclaim.STATUS_NO_PICK_UP,
          order_id: this.orderId
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  ::v-deep {
    div, span img, p, ul, li {
      box-sizing: border-box;
    }
  }
  .add-success {
    background: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    .icon {
      margin-top: 52px;
    }
    .title {
      margin-top: 19px;
      font-size: 18px;
      font-weight: 700;
      color: #333;
      line-height: 25px;
    }
    .desc {
      margin-top: 8px;
      padding: 0 32px;
      font-size: 13px;
      color: #999;
      line-height: 19px;
    }
    .reclaim-desc {
      margin-top: 19px;
    }
    .button {
      margin-top: 105px;
      width: 165px;
      font-size: 16px;
      font-weight: 700;
    }
  }
</style>
