<!--
  功能：业主端__回收单__取件信息and其他信息
  作者：Roy Li
  邮箱：lirong@aiforward.com
  时间：2021年11月26日 14:55:38
-->
<template>
  <div class="other">
    <div class="other-take">
      <div class="other-take__title">取件信息</div>
      <div class="other-take__container">
        <p v-show="info.room_name" class="other-take__container__text">取件地址：{{ info.room_name }}</p>
        <p v-show="info.consumer_name" class="other-take__container__text">
          客户信息：<span style="color: #E1AA6C;">{{ info.consumer_name }}&nbsp;{{ info.consumer_mobile | phoneEncryption }}</span>
        </p>
        <p v-show="info.picker_name" class="other-take__container__text">取件人：{{ info.picker_name }}&nbsp;{{ info.picker_mobile | phoneEncryption }}</p>
      </div>
    </div>
    <div class="other-take">
      <div class="other-take__title">订单信息</div>
      <div class="other-take__container">
        <p
          v-for="i in attrObject"
          v-show="info[i.attrText]"
          class="other-take__container__text"
          :key="i.sortId"
        >{{ i.label }}<span :style="`color: ${i.color};`">{{ i.attrFun ? i.attrFun(info[i.attrText]) : info[i.attrText] }}</span></p>
      </div>
    </div>
  </div>
</template>

<script>
import { homeReclaim } from '@/utils/const'
import dayjs from 'dayjs'
import { fen2yuan, phoneEncryption } from '@/utils'
export default {
  // 组件名称
  name: 'OtherInfo',
  // 组件参数 接收来自父组件的数据
  props: {
    info: {
      type: Object,
      default: () => ({})
    },
    type: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      homeReclaim
    }
  },
  // 局部注册的组件
  components: {
    OrderPickUpCode: () => import('views/getHomeReclaim/Components/ListItem/footers/OrderPickUpCode.vue')
  },
  // 计算属性
  computed: {
    attrObject () {
      const getTimeText = function (time) {
        return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
      }
      const getPiceText = function (price) {
        return `¥${fen2yuan(price)}`
      }
      const attrs1 = [
        {
          sortId: 1,
          label: '订单编号：',
          attrText: 'order_no'
        },
        {
          sortId: 2,
          label: '下单时间：',
          attrText: 'create_time',
          attrFun: getTimeText
        },
        {
          sortId: 3,
          label: '提交渠道：',
          attrText: 'submitter_type',
          attrFun (type) {
            return type === 1 ? '业主提交' : '代客提单'
          }
        },
        {
          sortId: 4,
          label: '提交人：',
          attrText: 'submitter_name',
          color: '#E1AA6C',
          attrFun: () => {
            return `${this.info.submitter_name} ${phoneEncryption(this.info.submitter_mobile)}`
          }
        },
        {
          sortId: 5,
          label: '回收金额抵抗物业费：',
          attrText: 'property_deduction',
          attrFun (deduction) {
            return deduction === 2 ? '是' : '否'
          }
        },
        {
          sortId: 6,
          label: '允许管家代确认：',
          attrText: 'allow_butler_confirm',
          attrFun (confirm) {
            return confirm === 2 ? '是' : '否'
          }
        },
        {
          sortId: 7,
          label: '估计单编号：',
          attrText: 'estimate_order_no',
          color: '#E1AA6C'
        },
        {
          sortId: 8,
          label: '估价人：',
          attrText: 'appraiser_name',
          attrFun: () => {
            return `${this.info.appraiser_name} ${phoneEncryption(this.info.appraiser_mobile)}`
          }
        }
      ]
      const attrs3 = [
        ...attrs1,
        {
          sortId: 9,
          label: '面客报价：',
          attrText: 'face_user_price',
          attrFun: getPiceText
        },
        {
          sortId: 10,
          label: '报价人：',
          attrText: 'quoter_name',
          attrFun: () => {
            return `${this.info.quoter_name} ${phoneEncryption(this.info.quoter_mobile)}`
          }
        },
        {
          sortId: 11,
          label: '报价时间：',
          attrText: 'quoter_time',
          attrFun: getTimeText
        },
        {
          sortId: 12,
          label: '回收商报价：',
          attrText: 'recycler_price',
          attrFun: getPiceText
        }
      ]
      const attrs4 = [
        ...attrs3,
        {
          sortId: 13,
          label: '报价确认人：',
          attrText: 'confirm_user_name'
        },
        {
          sortId: 14,
          label: '确认时间：',
          attrText: 'confirm_time',
          attrFun: getTimeText
        }
      ]
      const attrs5 = [
        ...attrs4,
        // 回收商取件状态：
        {
          sortId: 15,
          label: '回收商取件状态：',
          attrText: 'recycler_pickup_status',
          attrFun (status) {
            return status === 1 ? '待取件' : '已取件'
          }
        },
        {
          sortId: 16,
          label: '回收商支付状态：',
          attrText: 'recycler_pay_status',
          attrFun (status) {
            return status === 1 ? '待支付' : '已支付'
          }
        }
      ]
      const attrs = {
        1: attrs1,
        2: attrs1,
        3: attrs3,
        4: attrs4,
        5: attrs5,
        6: attrs1
      }
      return attrs[Number(this.type)]
    }
  },
  methods: {
    dayjs,
    fen2yuan
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
      &__info {
        @include qy-flex-center();
        background-color: #fff;
        padding: 12px 15px;
        &__left {
          @include ell();
          p {
            height: 25px;
            line-height: 25px;
            font-size: 15px;
            color: #333;
            span {
              color: #E1AA6C;
              text-decoration-line: underline;
            }
          }
        }
        &__right {
          flex: none;
          height: 64px;
          margin-left: 15px;
        }
      }
      &__container {
        background-color: #fff;
        padding: 0 15px;
        border: 1px solid #fff;
        &__item {
          padding: 17px 0;
          p {
            font-size: 15px;
            color: #333;
          }
          p:last-child {
            font-size: 12px;
            color: #999;
            margin-top: 8px;
          }
        }
        &__item:not(:first-child) {
          border-top: 1px solid #f1f1f1;
        }
        &__text {
          margin-bottom: 8px;
        }
        &__text:first-child {
          margin-top: 12px;
        }
        &__text:last-child {
          margin-bottom: 12px;
        }
      }
    }
  }
</style>
