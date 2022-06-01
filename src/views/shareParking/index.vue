<template>
  <div>
    <van-form
      ref="form"
      scroll-to-error
      :show-error-message="false"
      @submit="handleSubmit"
    >
      <div class="detail">
        <div class="detail-item">
          <van-swipe-cell>
            <div class="detail-title font-medium">
              <span class="font-weight">{{ detailObj.no }}</span>
              <!-- 订单状态标签 -->
              <div>
                <span
                  :class="[orderStatus[detailObj.order_state], 'order-label']"
                >{{ labelTxt[detailObj.order_state] }}</span>
              </div>
            </div>
            <div class="detail-main">
              <div class="detail-main-estate">
                <b> {{ detailObj["parking_name"] }}</b>
              </div>
              <div class="detail-main-estate">
                <span>所在小区：</span>
                <b> {{ detailObj["group_name"] }}</b>
              </div>
              <div class="detail-money">
                出租价格：<i>{{ detailObj["rent"] }} </i><span>元</span>
              </div>
              <div>
                <span>{{ getDate(detailObj["lease_duration"]) }}</span>
              </div>
            </div>
          </van-swipe-cell>
        </div>
        <!-- 发布页面详情 -->
        <div class="detail-item no-padding-top">
          <van-swipe-cell>
            <div class="detail-main">
              <div>
                <span
                  style="position: relative;"
                >出租方姓名：{{ detailObj["owner_user_name"] }}</span>
              </div>
              <div>
                <span
                  style="position: relative;"
                >出租方电话：{{ detailObj["owner_user_mobile"] }}</span>
              </div>
            </div>
          </van-swipe-cell>
        </div>

        <div class="detail-item no-padding-top">
          <van-swipe-cell>
            <div class="detail-main">
              <div>
                <span
                  style="position: relative;"
                >承租方姓名：{{ detailObj["tenantry_user_name"] }}</span>
              </div>
              <div>
                <span
                  style="position: relative;"
                >承租方电话：{{ detailObj["tenantry_user_mobile"] }}</span>
              </div>
            </div>
          </van-swipe-cell>
        </div>

        <div v-if="detailObj.pass_record_list && detailObj.pass_record_list.length" class="detail-item no-padding-top">
          <van-swipe-cell>
            <div class="detail-main detail-pass-time">
              <p>通行记录</p>
              <div
                v-for="({ pass_time, location }, index) in detailObj.pass_record_list"
                :key="index"
                class="pass-detail"
              >
                <span class="pass-time">{{ pass_time }}</span>
                <span class="pass-location">{{ location }}</span>
              </div>
            </div>
          </van-swipe-cell>
        </div>
      </div>
      <!--切换位置-->
      <FwParking v-if="detailObj.order_state === 20" :model="formModel" :opt="options[0]" :groupid="detailObj.group_id"/>
      <div class="detail reason-area" style="padding-top:12px">
        <div v-if="detailObj.need_reason && detailObj.order_state === 20" class="detail-item no-padding-top">
          <p class="reason-title">放行原因</p>
          <div class="err-msg">
            当前时间不在出租时间内，不建议放行，如需放行请填写原因
          </div>
          <van-field
            v-model="reason"
            class="fw-field inner-textarea inner-border"
            placeholder="请填写原因，50字内"
            maxlength="50"
            rows="4"
            type="textarea"
            :rules="[
              {
                required: true,
                message: '请输入原因'
              }
            ]"
          ></van-field>
        </div>
      </div>

      <div v-if="detailObj.order_state === 20" class="fw-btm-wrap btn parking-btn">
        <van-button
          class="round"
          size="large"
          :disabled="!canClick"
          native-type="submit"
        >确认</van-button>
      </div>
      <reminder currentPage="staff" :groupid="detailObj.group_id"/>
    </van-form>
  </div>
</template>

<script>
import { getOrderInfo, addStaff } from '@/api/shareparking'
import { objArray2StringArray } from '@/utils'
import Reminder from './reminder'
import FwParking from './FwParking'
export default {
  name: 'ShareParkingDetail',
  components: {
    FwParking,
    Reminder
  },
  props: {},
  data () {
    return {
      orderSn: '',
      orderStatus: {
        0: 'green',
        10: 'orange',
        12: 'red',
        15: 'gray',
        20: 'blue',
        30: 'gray',
        40: 'gray',
        50: 'gray'
      },
      labelTxt: {
        0: '已发布',
        10: '待支付',
        12: '过期未支付',
        15: '已退款',
        20: '承租中',
        30: '已完成',
        40: '已完成', // 对应结算中待领取
        50: '已完成'
      },
      detailObj: {},
      formModel: {},
      options: [
        {
          code: 'parking',
          type: 'fwParking',
          name: '通行位置',
          required: true,
          readonly: 0
        }
      ],
      canClick: true,
      popupShow: false,
      objArray2StringArray,
      reason: ''
    }
  },
  computed: {
    getDate (value) {
      return function (value) {
        const str = String(value)
        return str.replace(/-/g, '.')
      }
    }
  },
  watch: {},
  created () {
    this.orderSn = this.$route.query.orderSn
    if (this.orderSn !== '') { this.getDetail() }
  },
  mounted () {},
  methods: {
    getDetail () {
      // 获取详情
      const params = {}
      params.order_sn = this.orderSn
      getOrderInfo(params).then(res => {
        if (res.code === 200) {
          console.log(res)
          this.detailObj = res.data || {}
          if (this.detailObj.order_state !== 20) {
            this.$toast('二维码已经失效')
          }
        } else if (res.code === 400) {
          this.$router.push('/')
        } else {
          this.$toast(res.msg)
        }
      })
    },
    // 选择小区
    handleSubmit () {
      if (!this.canClick) {
        return
      } else {
        this.canClick = !this.canClick
      }
      let params = {}

      params = {
        order_sn: this.detailObj.order_sn || this.order_sn,
        location: this.formModel.parking,
        reason: this.reason
      }
      addStaff(params).then(res => {
        if (res.code === 200) {
          this.canClick = !this.canClick
          this.$router.push('/')
        } else {
          this.$toast(res.msg)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.orange {
  background: #fdf6ec;
  color: #e6a23e;
}
.blue {
  background: #ecf5ff;
  color: #46a1ff;
}
.gray {
  background: #f4f4f5;
  color: #909399;
}
.red {
  background: #fef0f0;
  color: #f56b6d;
}
.green {
  background: #f0f9eb;
  color: #6fc544;
}
.detail {
  // font-family: "PingFangSC-Regular, PingFang SC";
  padding: 8px 12px 3px 12px;
  &-item {
    background: #fff;
    border-radius: 4px;
    margin-bottom: 8px;
    padding: 8px 12px 0 12px;
    overflow: hidden;
    position: relative;
    &.no-padding-top {
      padding-top: 4px;
    }
  }
  &-title {
    font-size: 16px;
    color: #282828;
    display: flex;
    justify-content: space-between;
    .font-weight {
      font-weight: 600;
    }
  }
  &-main {
    &.detail-pass-time{
      padding-bottom: 8px;
    }
    p{
      margin-bottom: 7px;
      margin-bottom: 4px;
      // padding-left: 4px;
      color: #333;
    }
    div {
      width: 100%;
      box-sizing: border-box;
      display: flex;
      //  background: red;
       padding: 12px 0;
      align-items: center;
      font-size: 14px;
      color: #333;
    }
    .time {
      display: flex;
      align-items: center;
    }
    .pass-detail {
      display: flex;
      width: 100%;
      font-size: 12px;
      align-items: center;
      color: #999;
      padding: 12px 0;
      margin-bottom: 2px;
      justify-content: space-between;
      border-bottom: 1px solid #efefef;
    }
    .pass-time {
      flex: 1;
    }
    .pass-location {
      max-width: 180px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  &-main &-main-estate {
    // padding: 9px 0 6px 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    b {
      font-weight: normal;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      width: 250px;
    }
  }

  &-money {
    i {
      font-style: normal;
      color: #fa5151;
      display: inline-block;
      font-size: 17px;
    }
    span {
      display: inline-block;
      color: #fa5151;
      margin-left: 6px;
      font-size: 12px;
    }
  }
}

.order-label {
  font-size: 11px;
  display: block;
  border-radius: 2px;
  padding: 2px 11px;
}

.parking-btn button{
  margin: 38px 0;
  border-radius: 30px;
}

.inner-border{
  border-radius: 4px;
  // background: red;
}
.note{
  font-size: 14px;
  margin-left: 7px;
  color: #666666;
}

.reason-title{
  font-size: 15px;
  height: 15px;
  color: #333;
  margin-left: -5px;
  &::before{
    content: '*';
    font-size: 14px;
    color: #FA5151;
    display: inline-block;
    margin-right: 2px;
  }
}
.err-msg{
  font-size: 12px;
  padding-left: 3px;
  padding-top: 9px;
  color: #FA5151;
}
::v-deep {
  .van-field__label{
     color: #333;
     font-size: 15px;
  }
  .reason-area .van-cell {
    padding: 0;
  }
  .reason-area .van-field__control{
    width: 345px;
    // height: 100px;
    border-radius: 4px;
    background: #FAFAFA;
    padding:14px 16px;
    margin: 8px auto 15px;
  }
}

</style>
