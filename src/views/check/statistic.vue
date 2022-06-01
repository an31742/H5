<template>
  <div class="fw-container middle-content statisticpage">
    <!--汇总信息-->
    <div class="content summary">
      <div class="summary-head">
        <p class="summary-title">{{ month }}汇总</p>
        <p class="summary-detail" @click="viewSummary">
          当月汇总详情
          <van-icon name="arrow" color="#CDCDCD"></van-icon>
        </p>
      </div>
      <div class="summary-main">
        <div class="summary-item">
          <p class="summary-item-num">{{ (real_second/60/60).toFixed(2) }}</p>
          <p class="summary-item-text">平均工时</p>
        </div>
        <div class="summary-item">
          <p class="summary-item-num">{{ check_in_late_num }}</p>
          <p class="summary-item-text">迟到次数</p>
        </div>
        <div class="summary-item">
          <p class="summary-item-num">{{ check_out_early_num }}</p>
          <p class="summary-item-text">早退次数</p>
        </div>
      </div>
    </div>

    <!--每月记录-->
    <div class="content record">
      <div class="record-head">
        <p class="record-title">每月记录（{{ month }}）</p>
        <div class="record-explain">
          <p class="record-explain-item">
            <svg-icon class="work-icon" icon-class="sun-work" />白班
          </p>
          <p class="record-explain-item">
            <svg-icon class="work-icon" icon-class="mid-work" />中班
          </p>
          <p class="record-explain-item">
            <svg-icon class="work-icon" icon-class="night-work" />晚班
          </p>
          <p class="record-explain-item">
            <svg-icon class="work-icon" icon-class="no-work" />无班次
          </p>
        </div>
      </div>

      <!--日历插件-->
      <calendar ref="cal" initViewType="week" :calendarShow="true" @click-day="clickDay" @change="slideChange">
        <template slot="item-extra" slot-scope="item">
          <template v-if="clock_list[dayFormat(item.data)] && clock_list[dayFormat(item.data)].list">
            <svg-icon v-if="hasWork(clock_list[dayFormat(item.data)], 1)" class="work-icon" icon-class="sun-work" />
            <svg-icon v-if="hasWork(clock_list[dayFormat(item.data)], 2)" class="work-icon" icon-class="mid-work" />
            <svg-icon v-if="hasWork(clock_list[dayFormat(item.data)], 3)" class="work-icon" icon-class="night-work" />
          </template>
          <svg-icon v-else class="work-icon" icon-class="no-work" />
        </template>
      </calendar>

      <!--某天汇总-->
      <template v-if="selectedItem && selectedItem.list">
        <!--几次卡，总工时-->
        <!-- <p class="rule" style="font-size: 0.48rem;">共{{ selectedItem.real_clock_num }}次卡，工时{{ (selectedItem.real_clock_second/3600).toFixed(2) }}小时</p> -->
        <!-- {{getTotalTime(selectedItem)}} -->
        <!--班次详情-->
        <div v-for="(item, index) in selectedItem.list" :key="index" class="schedule-item">
          <!-- 4.21优化 -->
          <p class="title">{{ item.term.name }} {{ item.work_info.term_clock_num }}次卡，工时{{ item.work_info.term_work_time }}小时</p>
          <!--说明、类型、上下班时间-->
          <!--   <p class="rule">
            <span v-if="item.remark_dsc">{{ item.plan.remark_dsc }}</span>
            <span>{{ getLabelByValue('SCHEDULE_TERM_TYPE', item.term.type) }}</span> -->
          <!-- <span>{{dayjs(item.start_time*1000).format('HH:mm')}}-{{dayjs(item.end_time*1000).format('HH:mm')}}</span> -->
          <!--   </p> -->

          <!--排班详情-->
          <div v-for="(clockItem, clockIndex) in item.clock" :key="clockIndex" class="record-check">
            <div class="record-check-time" style="margin-bottom:40px;">
              <svg-icon :class="clockItem.check_in_time?'record-check-checkedicon':''" icon-class="checked" />
              <span class="record-check-time-text">上班时间 {{ formatTime(compTimeStamp(clockItem.start_time)) }}</span>
              <span v-if="clockItem.check_in_time" class="record-check-time-clocked">打卡时间：{{ formatTime(compTimeStamp(clockItem.check_in_time)) }}</span>
              <span v-if="getLabelByValue('SCHEDULE_CHECK_STATUS',clockItem.check_in_status)" class="check-time-tag" :class="statusClassMap[clockItem.check_in_status]">
                {{ getLabelByValue('SCHEDULE_CHECK_STATUS',clockItem.check_in_status) }}
              </span>
            </div>
            <div class="record-check-time">
              <svg-icon :class="clockItem.check_out_time?'record-check-checkedicon':''" icon-class="checked" />
              <span class="record-check-time-text">下班时间 {{ formatTime(clockItem.end_time) }}</span>
              <span v-if="clockItem.check_out_time" class="record-check-time-clocked">打卡时间：{{ formatTime(compTimeStamp(clockItem.check_out_time)) }}</span>
              <span v-if="getLabelByValue('SCHEDULE_CHECK_STATUS',clockItem.check_out_status)" class="check-time-tag" :class="statusClassMap[clockItem.check_out_status]">
                {{ getLabelByValue('SCHEDULE_CHECK_STATUS',clockItem.check_out_status) }}
              </span>
            </div>
          </div>
        </div>
      </template>
      <p v-else class="rule">暂无排班信息</p>
    </div>
  </div>
</template>

<script>
import { staffScheduleClockList } from '@/api/check'
import calendar from '../components/calendar'
import { mapGetters } from 'vuex'
import dayjs from 'dayjs'

export default {
  name: 'CheckStatistic',
  components: {
    calendar
  },
  data () {
    return {
      dayjs,
      month: 0,
      clock_list: {},
      selectedItem: {},
      real_second: '',
      check_in_late_num: '',
      check_out_early_num: '',
      statusClassMap: {
        1: '',
        2: 'yellow',
        3: 'red',
        4: '',
        5: 'yellow',
        6: 'red'
      },
      nowDate: ''
    }
  },
  computed: {
    ...mapGetters([
      'appConfig'
    ])
  },
  mounted () {
    const flag = this.$refs.cal.flag
    this.month = dayjs(flag).format('MM月')
    this.nowDate = dayjs(flag).format('YYYY-MM-DD')
    // this.$nextTick(() => {
    //   this.getInfo()
    // })
  },
  methods: {
    // 获取枚举里对应的值
    getLabelByValue (key, value) {
      let list = this.appConfig[key] || []

      list = list.filter(item => item.value === value)

      return list[0] ? list[0].label : ''
    },
    // 获取总打卡时长
    getTotalTime (arr) {
      const sum = (t, n) => (t['term_seconds'] || 0) + (n['term_seconds'] || 0)
      const time = arr.reduce(sum, 0)

      return (time / 60 / 60).toFixed(2)
    },
    // 查看汇总信息
    viewSummary () {
      const flag = this.$refs.cal.flag
      const query = { date: dayjs(flag).format() }

      this.$router.push({ name: 'CheckDetail', query })
    },
    // 获取信息
    getInfo () {
      const arr = this.$refs.cal.getDaysRegion('month')
      const params = {
        start_date: this.dayFormat(arr[0]),
        end_date: this.dayFormat(arr[arr.length - 1])
      }
      staffScheduleClockList(params).then(res => {
        if (res.code === 200) {
          const data = res.data || {}
          this.real_second = data.average_second || ''
          this.check_in_late_num = data.check_in_late_num || 0
          this.check_out_early_num = data.check_out_early_num || 0
          this.clock_list = data.detail || []
          this.selectedItem = this.clock_list[this.nowDate] || []
          // console.error(this.selectedItem, '考勤记录')
        } else {
          this.$toast(res.msg || '获取信息失败')
        }
      })
    },
    // 年月日 - 时间对象转字符串时间
    dayFormat (obj) {
      return `${obj.year}-${this.formatZero(obj.month)}-${this.formatZero(obj.date)}`
    },
    // 是否有对应的班次
    hasWork (obj, type) {
      return (obj.list || []).filter(item => item.term.type + '' === type + '').length > 0
    },
    // 点击天
    clickDay (m) {
      const day = this.dayFormat(m)
      this.selectedItem = this.clock_list[day] || []
    },
    // 月更换
    slideChange (m) {
      this.month = m.format('MM月')
      this.$nextTick(() => {
        this.getInfo()
      })
    },
    // 时间对象转字符串时间
    // timeObject2String (obj) {
    //   return `${obj.year}-${this.formatZero(obj.month)}-${this.formatZero(obj.date)}`
    // },
    formatZero (t) {
      return t < 10 ? `0${t}` : t
    },
    formatTime (t) {
      return t ? dayjs(t).format('HH:mm') : ''
    }
  }
}
</script>

<style type="text/css" lang="scss" scoped>
  .statisticpage {
    padding: 10px;
    box-sizing: border-box;
    background-color: #F3F4F8;
    min-height: calc(100vh - 44px);
    font-family: PingFangSC-Regular, PingFang SC;

    .content {
      background-color: #fff;
      border-radius: 6px;
    }

    .summary {
      padding: 10px;
      box-sizing: border-box;

      &-head {
        padding: 0 2px 7px;
        box-sizing: border-box;
        border-bottom: 1px solid #F6F8FA;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      &-title {
        font-size: 16px;
        color: #333;
        font-weight: 500;
        line-height: 22px;
        font-family: PingFangSC-Medium, PingFang SC;
      }

      &-detail {
        font-size: 14px;
        color: #BDBDBD;
        line-height: 18px;
        display: flex;
        align-items: center;

        .van-icon-arrow {
          font-size: 16px;
        }
      }

      &-main {
        padding: 16px 0 3px 0;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: space-around;
      }

      &-item {
        text-align: center;
        color: #333;

        &-num {
          font-size: 22px;
          line-height: 30px;
          font-weight: 500;
          font-family: PingFangSC-Medium, PingFang SC;
        }

        &-text {
          font-size: 14px;
          line-height: 18px;
          margin-top: 2px;
          font-family: PingFangSC-Light, PingFang SC;
        }
      }
    }

    .record {
      margin-top: 10px;
      padding-bottom: 24px;

      &-head {
        padding: 12px 20px 10px 15px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      &-title {
        font-size: 16px;
        color: #333;
        line-height: 22px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
      }

      &-explain {
        display: flex;

        &-item {
          font-size: 12px;
          color: #D0D0D0;
          font-weight: 400;
          line-height: 16px;
          display: flex;
          align-items: center;
          margin-right: 10px;

          &:last-child {
            margin-right: 0;
          }
        }
      }

      &-check {
        margin: 0 15px 30px;
        position: relative;

        &::before {
          content: '';
          display: block;
          position: absolute;
          left: 5px;
          top: 6%;
          width: 2px;
          height: 88%;
          background-color: #F6F8FA;
        }

        &-time {
          display: flex;
          align-items: center;

          &-text, &-clocked {
            font-size: 16px;
            line-height: 22px;
            color: #333;
            font-weight: 400;
            margin-left: 13px;
          }

          &-text {
            width: 120px;
          }

          &-clocked {
            margin-left: 10px;
            color: rgba(51, 51, 51, 0.5);
          }

          &-tag {
            border-radius: 4px;
            color: #fff;
            font-size: 12px;
            line-height: 16px;
            padding: 2px 7px;
            box-sizing: border-box;
            background: #63CCA7;
            margin-left: 8px;
          }
        }

        &-checkedicon {
          z-index: 2;
          background-color: #fff;
        }
      }
    }

    .svg-icon {
      font-size: 12px;
      z-index: 2;
    }

    .rule {
      font-size: 15px;
      line-height: 21px;
      color: #333;
      font-weight: 400;
      padding: 0 15px 24px;
    }
  }
  .work-icon {
    color: red;
  }
  .schedule-item:not(:last-child) {
    padding-bottom: 40px;
  }
  .title{
    font-size: 15px;
    font-weight: 700;
    color: #333;
    padding:0 0 20px 15px;
  }
</style>
