<!--
  功能：填写报价
  作者：Roy Li
  邮箱：lirong@aiforward.com
  时间：2021年12月07日 16:06:05
-->
<template>
  <van-form class="submit-evaluation-form" @submit="fromSubmit">
    <van-field
      v-model="faceUserPrice"
      required
      maxlength="9"
      type="number"
      input-align="right"
      name="face_user_price"
      label="面客报价"
      placeholder="请输入面客报价"
      :error-message="faceMessage"
      :rules="[{ validator: validatorFacePrice, trigger: 'onBlur' }]"
      @input="faceUserValidator"
    >
      <template #button>
        <span>元</span>
      </template>
    </van-field>
    <van-field
      v-model="recyclerPrice"
      required
      maxlength="9"
      type="number"
      input-align="right"
      name="recycler_price"
      label="回收商报价"
      placeholder="请输入回收商报价"
      :error-message="recyclerMessage"
      :rules="[{ validator: validatorRecyclerPrice, trigger: 'onBlur' }]"
      @input="recyclerValidator"
    >
      <template #button>
        <span>元</span>
      </template>
    </van-field>
    <van-field
      :value="confirmLastTime && dayjs(confirmLastTime).format('YYYY年MM月DD日 HH:mm')"
      required
      readonly
      input-align="right"
      right-icon="clock-o"
      name="confirm_last_time"
      label="确认时限"
      placeholder="请选择时限"
      @click="showPicker = true"
      :rules="[{ validator: val => !!val }]"
    >
    </van-field>
    <div class="submit-button">
      <van-button
        round
        block
        :border="false"
        native-type="submit"
        color="#E1AA6C"
        text="提交"
        class="submit-button-size"
      />
    </div>
    <van-action-sheet v-model="showPicker" title="选择时限">
      <van-datetime-picker
        v-model="timeLimit"
        class="content"
        type="datetime"
        :min-date="minDate"
        :max-date="maxDate"
        @cancel="showPicker = false"
        @confirm="confirmTime"
      />
    </van-action-sheet>
  </van-form>
</template>

<script>
import dayjs from 'dayjs'
import { Toast } from 'vant'
import { putOrderStatus } from 'api/getHomeReclaim'
import { homeReclaim } from '../../utils/const'
export default {
  // 组件名称
  name: 'SetRealAmount',
  // 组件参数 接收来自父组件的数据
  props: {},
  // 局部注册的组件
  components: {},
  // 组件状态值
  data () {
    return {
      faceUserPrice: '',
      recyclerPrice: '',
      faceMessage: '',
      recyclerMessage: '',
      minDate: new Date(),
      maxDate: new Date(2060, 1, 1),
      timeLimit: new Date(),
      confirmLastTime: '',
      showPicker: false,
      orderId: this.$route.query.order_id,
      isSending: false
    }
  },
  // 计算属性
  computed: {},
  // 侦听器
  watch: {},
  // 组件方法
  methods: {
    dayjs,
    faceUserValidator () {
      this.validator(this.faceUserPrice, 'faceMessage')
    },
    recyclerValidator () {
      this.validator(this.recyclerPrice, 'recyclerMessage')
    },
    validator (amount, attr = '') {
      if (amount && Number(amount) >= 1000000) {
        this[attr] = '请填写小于一百万的金额'
      }
      if (amount) {
        const text = amount.split('.')[1]
        if (text && text.length > 2) {
          this[attr] = '金额的小数最多只有两位'
        }
      }
      this[attr] = ''
    },
    fromSubmit () {
      if (this.isSending || this.faceMessage || this.recyclerMessage) return
      this.isSending = true
      putOrderStatus({
        action: 3,
        order_id: this.orderId,
        face_user_price: Number(this.faceUserPrice) * 100,
        recycler_price: Number(this.recyclerPrice) * 100,
        confirm_last_time: this.timeLimit
      }).then((res) => {
        this.isSending = false
        if (res.code === 200) {
          this.$store.dispatch('getHomeReclaim/setUpdateListData', {
            pageType: homeReclaim.reclaim,
            orderId: this.orderId,
            deleteItem: true
          })
          this.$router.back()
        }
      }).catch(() => {
        this.isSending = false
      })
    },
    confirmTime (val) {
      this.showPicker = false
      this.confirmLastTime = val
    },
    validatorFacePrice (val) {
      if (val && this.recyclerPrice && Number(this.recyclerPrice) < Number(val)) {
        Toast.fail('面客报价不能高于回收商报价')
        return false
      }
      return !!val
    },
    validatorRecyclerPrice (val) {
      if (val && this.faceUserPrice && Number(this.faceUserPrice) > Number(val)) {
        Toast.fail('回收商报价不能小于面客报价')
        return false
      }
      return !!val
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
  .submit-evaluation-form {
    box-sizing: border-box;
    padding-top: 1px;
    padding-bottom: 64px;
    background: #F8F9FA;
    padding-left: 16px;
    padding-right: 16px;
    background: #fff;
    ::v-deep {
      .van-cell--required::before {
        left: -8px;
      }
    }
    ::v-deep.van-cell {
      padding-right: 0;
      padding-left: 0;
    }
    ::v-deep.van-cell::after {
      right: 0;
      left: 0;
    }
    .submit-button {
      position: absolute;
      left: 0;
      bottom: 0;
      right: 0;
      width: 100%;
      box-sizing: border-box;
      padding: 10px 16px;
      background: #fff;
      &-size {
        font-size: 16px;
      }
    }
  }
</style>
