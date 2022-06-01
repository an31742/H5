<!--
  功能：员工端__估价单__待估价--提交估价
  作者：Roy Li
  邮箱：lirong@aiforward.com
  时间：2021年11月26日 14:55:38
-->
<template>
  <div class="other">
    <div class="other-take">
      <div class="other-take__title">估价</div>
      <div class="other-take__container">
        <van-field
          v-model="amount"
          colon
          required
          :error-message="errorMessage"
          maxlength="9"
          type="number"
          label="估价"
          placeholder="请填写物品估价"
          @input="validator"
        >
          <template #button>
            <span>元</span>
          </template>
        </van-field>
      </div>
    </div>
    <div class="fixed-bottom edit-submit">
      <van-button
        round
        block
        class="edit-submit__button"
        color="#E1AA6C"
        native-type="button"
        @click.stop="submit"
      >提交估价</van-button>
    </div>
  </div>
</template>

<script>
import { homeReclaim } from '@/utils/const'
import { setAppraisal } from 'api/getHomeReclaim'
import { Toast } from 'vant'
export default {
  // 组件名称
  name: 'SubmitAmount',
  // 组件参数 接收来自父组件的数据
  props: {
    orderId: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      amount: '',
      errorMessage: ''
    }
  },
  methods: {
    validator () {
      if (this.amount && Number(this.amount) >= 1000000) {
        this.errorMessage = '请填写小于一百万的金额'
      }
      if (this.amount) {
        const text = this.amount.split('.')[1]
        if (text && text.length > 2) {
          this.errorMessage = '金额的小数最多只有两位'
        }
      }
      this.errorMessage = ''
    },
    submit () {
      if (!this.amount || this.errorMessage) {
        Toast({
          message: '请填写正确的物品估价'
        })
        return
      }
      // 提交订单or取消
      setAppraisal({
        status: 2,
        estimate_order_id: this.orderId,
        appraisal: Number(this.amount) * 100
      }).then((res) => {
        if (res.code !== 200) {
          Toast.fail(res.msg || '提交失败')
          return
        }
        this.$store.dispatch('getHomeReclaim/setUpdateListData', {
          pageType: homeReclaim.evaluation,
          orderId: this.orderId,
          deleteItem: true
        })
        this.$emit('refreshDetail')
      }).catch((e) => {
        Toast.fail(e.msg || '提交失败')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @mixin qy-flex-center () {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .other {
    &-take {
      &__title {
        height: 36px;
        line-height: 36px;
        padding-left: 15px;
        font-size: 12px;
        color: #999;
      }
      &__container {
        background-color: #fff;
        padding: 0px;
        border: 1px solid #fff;
      }
    }
    .edit-submit {
      padding: 0 16px;
      width: 100%;
      height: 64px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #FFFFFF;
      border-top: 1px solid #F1F1F1;
      .edit-submit__button {
        flex: 1;
      }
    }
  }
  ::v-deep .van-field__label {
    width: auto;
  }
  ::v-deep .van-field__button {
    color: #333;
  }
</style>
