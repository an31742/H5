<!--
  功能：详情页
  作者：Roy Li
  邮箱：lirong@aiforward.com
  时间：2021年11月24日 11:26:34
-->
<template>
  <div class="goods">
    <!-- 物品详情信息 -->
    <div class="goods__info">
      <!-- 物品媒体资源 -->
      <van-swipe
        class="goods__info__media"
        :autoplay="3000"
        @change="onChange"
      >
        <van-swipe-item class="goods__info__media__item" v-for="(image, index) in info.images" :key="index">
          <img v-lazy="image" @click="imagePreview" />
        </van-swipe-item>
        <template #indicator>
          <div class="custom-indicator">{{ `${current + 1}/${info.images.length}` }}</div>
        </template>
      </van-swipe>
      <!-- 物品描述信息 -->
      <div class="goods__info__message">
        <!-- 标题 -->
        <div class="goods__info__message__title">
          物品信息
          <van-tag
            v-if="goodsType"
            round
            class="goods__info__message__title__tag"
            size="medium"
          >{{ goodsType }}</van-tag>
          <div style="flex: 1;"></div>
          <van-tag
            v-if="info.goods_status === 4"
            size="large"
            class="goods__info__message__title__status m-r-12"
            color="#F0F9EB"
            text-color="#6FC544"
          >已取回</van-tag>
          <van-tag
            v-if="info.settlement_status === 2"
            size="large"
            class="goods__info__message__title__status m-r-12"
            color="#ECF5FF"
            text-color="#46A1FF"
          >已结算</van-tag>
          <van-tag
            v-if="orderType"
            size="large"
            class="goods__info__message__title__status"
            :color="orderType.color"
            :text-color="orderType['text-color']"
          >{{ orderType.text }}</van-tag>
        </div>
        <!-- 品牌、时长... -->
        <div v-if="info.brand" class="goods__info__message__text message__text--multiline">
          <span class="message__text--multiline__label">品牌及型号：</span>
          <span>{{ info.brand }}</span>
        </div>
        <div class="goods__info__message__text">使用时长：{{ useTime }}</div>
        <div class="goods__info__message__text message__text--multiline">
          <span class="message__text--multiline__label">使用状况描述：</span>
          <span>{{ info.description }}</span>
        </div>
      </div>
    </div>
    <!-- 估价单__提交渠道 -->
    <submitter
      v-if="isEvaluation"
      :submitterType="info.submitter_type"
      :submitterName="info.submitter_name"
      :submitterMobile="info.submitter_mobile | phoneEncryption"
      :createTime="info.createTimeText"
    />
    <!-- 估价信息 -->
    <predict-amount
      v-if="(isEvaluation || isShowEditInfo) && (info.appraisal || info.dealAmount)"
      :type="type"
      :amount="info.appraisalText"
      :confirmLastTime="info.confirmLastTime"
      :action="info.cancel_channel"
    />
    <!-- 编辑订单相关信息 -->
    <edit-info v-if="isShowEditInfo" @refreshDetail="getDetail()" />
    <!-- 员工端--待估价__填写估价 -->
    <submit-amount
      v-if="isNoEvaluate"
      :orderId="orderId"
      @refreshDetail="getDetail()"
    />
    <other-info v-if="!isEvaluation && !isValet" :info="info" :type="type" />
    <!-- 已估价和代客提单用自己的button -->
    <order-footer
      v-if="!isShowEditInfo && !isNoEvaluate"
      :type="type"
      :buttomText="buttomText"
      :dealAmount="info.dealAmount"
      :cancelChannel="info.cancel_channel"
      :orderId="info.order_id"
      :settlementStatus="info.settlement_status"
      :goodsStatus="info.goods_status"
      :allowButlerConfirm="info.allow_butler_confirm"
      @refreshDetail="getDetail()"
    />
  </div>
</template>

<script>
import { ImagePreview } from 'vant'
import { homeReclaim } from '@/utils/const.js'
import { getAppraisalDetail, getReclaimDetail } from '@/api/getHomeReclaim'
import { fen2yuan } from '@/utils'
import dayjs from 'dayjs'
export default {
  // 组件名称
  name: 'ReclaimOrderDetail',
  // 局部注册的组件
  components: {
    PredictAmount: () => import('./Compontens/PredictAmount.vue'),
    EditInfo: () => import('./Compontens/EditInfo.vue'),
    OtherInfo: () => import('./Compontens/OtherInfo.vue'),
    OrderFooter: () => import('./Compontens/OrderFooter.vue'),
    SubmitAmount: () => import('./Compontens/SubmitAmount.vue'),
    Submitter: () => import('./Compontens/Submitter.vue')
  },
  // 组件状态值
  data () {
    return {
      homeReclaim,
      current: 0,
      type: this.$route.query.type,
      orderId: Number(this.$route.query.order_id) || 0,
      info: {
        images: []
      }
    }
  },
  // 计算属性
  computed: {
    goodsType () {
      const types = {
        1: '3C',
        2: '家电'
      }
      return types[this.info.goods_category]
    },
    orderType () {
      const types = {
        1: {
          color: '#F0F9EB',
          text: '待取件',
          'text-color': '#6FC544'
        },
        2: {
          color: '#F0F9EB',
          text: '待报价',
          'text-color': '#6FC544'
        },
        3: {
          color: '#FDF6EC',
          text: '待确认',
          'text-color': '#E6A23E'
        },
        4: {
          color: '#FDF6EC',
          text: '待支付',
          'text-color': '#E6A23E'
        },
        5: {
          color: '#ECF5FF',
          text: '已完成',
          'text-color': '#46A1FF'
        },
        6: {
          color: '#F1F1F1',
          text: '已取消',
          'text-color': '#999'
        }
      }
      return types[Number(this.type)]
    },
    useTime () {
      const useTime = this.appConfig.ESTIMATE_GOODS_USE_TIME_LIST || []
      const index = useTime.findIndex(item => item.value === this.info.user_time)
      if (index === -1) return ''
      return useTime[index].label
    },
    isEvaluation () {
      return [homeReclaim.STATUS_NO_EVALUATE, homeReclaim.STATUS_EVALUATE, homeReclaim.EVALUATION_STATUS_END, homeReclaim.EVALUATION_STATUS_CANCEL].includes(this.type)
    },
    isValet () {
      return [homeReclaim.STAFF_STATUS_NO_EVALUATE, homeReclaim.STAFF_STATUS_EVALUATE, homeReclaim.STAFF_EVALUATION_STATUS_END, homeReclaim.STAFF_EVALUATION_STATUS_CANCEL].includes(this.type)
    },
    isEndValet () {
      return [homeReclaim.STAFF_EVALUATION_STATUS_END].includes(this.type)
    },
    isNoEvaluate () {
      return [homeReclaim.STATUS_NO_EVALUATE].includes(this.type)
    },
    isShowEditInfo () {
      return this.type === homeReclaim.STAFF_STATUS_EVALUATE && this.info.status === 2
    },
    buttomText () {
      const texts = {
        [homeReclaim.STATUS_EVALUATE]: {
          3: '您已提交订单',
          4: '您已取消订单'
        }
      }
      return texts[this.type]?.[this.info.status] || ''
    }
  },
  // 组件方法
  methods: {
    // 请求详情数据
    getDetail () {
      if (this.isEvaluation || this.isValet) {
        this.getAppraisalDetail()
      } else {
        this.getReclaimDetail()
      }
    },
    onChange (index) {
      this.current = index
    },
    imagePreview () {
      ImagePreview({
        images: this.info.images,
        startPosition: this.current,
        closeable: true
      })
    },
    // 估价单详情
    getAppraisalDetail () {
      getAppraisalDetail({
        estimate_order_id: this.orderId
      }).then(res => {
        if (res.code !== 200) return
        const data = res.data
        const appraisal = data.appraisal
        appraisal && (data.appraisalText = `￥${fen2yuan(appraisal)}`)
        data.createTimeText = dayjs(data.create_time).format('YYYY-MM-DD HH:mm:ss')
        this.updateEvaluationType(data.status)
        this.info = data
      }).catch()
    },
    // 回收订单详情
    getReclaimDetail () {
      getReclaimDetail({
        order_id: this.orderId
      }).then((res) => {
        if (res.code !== 200) return
        const data = res.data
        if (Number(this.type) !== data.order_status) this.updateType(data.order_status + '')
        const appraisal = data.appraisal
        appraisal && (data.appraisalText = `￥${fen2yuan(appraisal)}`)
        data.dealAmount = ''
        data.face_user_price && (data.dealAmount = `￥${fen2yuan(data.face_user_price)}`)
        data.confirmLastTime = dayjs(data.confirm_last_time).format('YYYY-MM-DD HH:00:00')
        this.info = data
      }).catch(() => {})
    },
    updateType (val) {
      this.type = val
    },
    updateEvaluationType (orderStatus) {
      const evaluateTypes = [
        {
          text: homeReclaim.STATUS_NO_EVALUATE,
          key: 1
        },
        {
          text: homeReclaim.STATUS_EVALUATE,
          key: 2
        },
        {
          text: homeReclaim.EVALUATION_STATUS_END,
          key: 3
        },
        {
          text: homeReclaim.EVALUATION_STATUS_CANCEL,
          key: 4
        }
      ]
      const valetTypes = [
        {
          text: homeReclaim.STAFF_STATUS_NO_EVALUATE,
          key: 1
        },
        {
          text: homeReclaim.STAFF_STATUS_EVALUATE,
          key: 2
        },
        {
          text: homeReclaim.STAFF_EVALUATION_STATUS_END,
          key: 3
        },
        {
          text: homeReclaim.STAFF_EVALUATION_STATUS_CANCEL,
          key: 4
        }
      ]
      const types = this.isValet ? valetTypes : evaluateTypes
      const it = types.find(i => i.key === orderStatus)
      if (it && it.text !== this.type) {
        this.type = it.text
      }
    }
  },
  /**
  * 组件实例创建完成，属性已绑定，但DOM还未生成，$ el属性还不存在
  */
  created () {
    if (!this.type) throw new Error('缺失关键参数')
    this.getDetail()
  }
}
</script>

<style lang="scss" scoped>
  ::v-deep {
    div, span img, p {
      box-sizing: border-box;
    }
  }
  .goods {
    box-sizing: border-box;
    padding-bottom: 100px;
    &__info {
      display: flex;
      flex-direction: column;
      align-items: center;
      &__media {
        height: 365px;
        width: 365px;
        border-radius: 10px;
        margin: 5px 0;
        background-color: #fff;
        .custom-indicator {
          width: 38px;
          height: 21px;
          position: absolute;
          right: 16px;
          bottom: 16px;
          padding: 2px 5px;
          font-size: 12px;
          background: rgba(0, 0, 0, 0.1);
          background: rgba(0, 0, 0, .8);
          border-radius: 11px;
          color: #fff;
          text-align: center;
        }
        &__item {
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }
      }
      &__message {
        background-color: #fff;
        width: 100%;
        padding: 12px 15px;
        color: #333;
        &__title {
          height: 32px;
          line-height: 32px;
          font-size: 17px;
          font-weight: 700;
          display: flex;
          align-items: center;
          &__tag {
            margin-left: 8px;
            padding: 1px 10px;
            line-height: 16px;
            background: rgba(225, 170, 108, .1);
            color: #E1AA6C;
            font-size: 12px;
            text-align: center;
          }
          &__status {
            box-sizing: border-box;
            padding: 0px;
            width: 55px;
            height: 22px;
            justify-content: center;
            font-size: 12px;
            border-radius: 2px;
          }
        }
        &__text {
          line-height: 32px;
          font-size: 15px;
        }
        .message__text--multiline {
          line-height: 23px;
          display: flex;
          white-space: pre-wrap;
          word-break: break-all;
          &__label {
            flex: none;
          }
        }
      }
    }
    .m-r-12 {
      margin-right: 12px;
    }
  }
</style>
