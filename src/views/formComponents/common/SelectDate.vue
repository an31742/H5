<template>
  <div class="cal-wrap">
    <!--选择日期弹层-->
    <van-calendar
      v-model="popupDateShow"
      color="#E1AA6C"
      row-height="48"
      class="fw-cal-wrap form-component"
      :max-date="maxDate"
      :round="false"
      :show-mark="false"
      :type="calendarType"
      :formatter="formatter"
      :get-container="getBodyContainer"
      @confirm="selectDate"
    >
    </van-calendar>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import mixin from '../mixin'

export default {
  name: 'SelectDate',
  mixins: [mixin],
  props: {
    calendarType: {
      type: String,
      default: () => 'single'
    },
    timeFormat: {
      type: String,
      default: () => 'YYYY-MM-DD'
    },
    optProps: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      dayjs,
      popupDateShow: false
    }
  },
  computed: {
    maxDate () {
      // 最大可选天数
      if (this.optProps && this.optProps.limitDays && this.optProps.limitDays > 0) {
        return new Date(dayjs(new Date()).add(this.optProps.limitDays - 1, 'day'))
      }

      // 默认半年内
      return new Date(dayjs(new Date()).add(6, 'month'))
    }
  },
  methods: {
    // 选择日期弹框
    show () {
      this.popupDateShow = true
    },
    // 格式化日期显示
    formatter (day) {
      if (dayjs(day.date).format('YYYY-MM-DD') === dayjs(new Date()).format('YYYY-MM-DD')) {
        day.className = 'current'
      }
      day.bottomInfo = ''

      return day
    },
    // 选择日期
    selectDate (date) {
      this.popupDateShow = false

      // 日期范围
      if (Array.isArray(date)) {
        const str = dayjs(date[0]).format(this.timeFormat)
        const etr = dayjs(date[1]).format(this.timeFormat)

        this.$emit('confirm', { arr: [str, etr], str: `${str} ~ ${etr}` })
      } else {
        const str = dayjs(date).format(this.timeFormat)
        this.$emit('confirm', { str })
      }
    }
  }
}
</script>

<style lang="scss">
  .fw-cal-wrap {
    &.van-popup {
      &.van-popup--bottom.van-calendar__popup {
        border-radius: 0;
      }
      .van-popup__close-icon--top-right {
        right: 10px;
        position: absolute;
        font-size: 20px;
        text-align: center;
        color: #999;
        background: #fff;
        font-weight: normal;
        padding: 0;
      }

      .van-calendar {
        font-family: PingFangSC-Regular, PingFang SC;
        .van-calendar__header-title {
          height: 48px;
          background: #FFFFFF;
          border-bottom: 1px solid #EEEEEE;
        }
        .van-calendar__header-subtitle {
          font-size: 18px;
          font-weight: 400;
          color: #333333;
          line-height: 25px;
          padding: 10px;
          height: 25px;
        }
        .van-calendar__weekdays {
          height: 45px;
          background: #FFFFFF;
        }
        .van-calendar__weekday {
          line-height: 45px;
          font-size: 15px;
          font-weight: 500;
          color: #333333;
        }
        .van-calendar__day {
          height: 25px;
          font-size: 18px;
          font-weight: 400;
          color: #333333;
          line-height: 25px;
          margin-bottom: 5px;
          &.current {
            position: relative;
            &::after {
              background: linear-gradient(176deg, #F2D5A5 0%, #E1AA6C 100%);
              content: '';
              width: 5px;
              height: 5px;
              border-radius: 50%;
              position: absolute;
              bottom: 5px;
            }
          }
          &.van-calendar__day--disabled {
            color: #CCCCCC;
          }
          &.van-calendar__day--start, &.van-calendar__day--end, .van-calendar__day--start-end {
            color: #fff;
            font-weight: 500;
          }
          &.van-calendar__day--middle {
            background: #FCF7ED;
          }
        }
        .van-calendar__month-title {
          font-size: 18px;
          font-weight: 400;
          color: #999;
          line-height: 25px;
          padding: 10px;
          height: 25px;
        }
        .van-calendar__footer {padding: 16px 36px;}
        .van-calendar__confirm {
          height: 40px;
          background: linear-gradient(45deg, #F2D5A5 0%, #E1AA6C 100%) !important;
          border-radius: 20px;
          margin: 0;
          font-size: 18px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          line-height: 25px;
          border: none;
        }
        .van-calendar__header {
          box-shadow: none;
          border-bottom: 1px solid #eee;
        }
      }
    }
  }
</style>
