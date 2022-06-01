<template>
  <div class="calendar-wrap bgfff">
    <div v-if="dateSwitchShow" class="head-info">
      <div class="short-cut">
        <a :class="viewType==='week'?'active':''" @click="changeView('week')">周</a>
        <a :class="viewType==='month'?'active':''" @click="changeView('month')">月</a>
      </div>
      <div class="show-time">
        <svg-icon icon-class="calendar-left" class="icon-arrow" @click="narrowClick(-1)"/>
        <template v-if="viewType==='month'">
          <span>{{ dayjs(flag).format('YYYY年MM月') }}</span>
        </template>
        <template v-else>
          <span>{{ formatWeek() }}</span>
        </template>
        <svg-icon icon-class="calendar-right" class="icon-arrow" @click="narrowClick(1)"/>
      </div>
    </div>

    <!--星期-->
    <template v-if="calendarShow">
      <div class="week-title">
        <span v-for="(item, index) in weekdays" :key="index">
          <slot name="week-title" :data="item">{{ item }}</slot>
        </span>
      </div>

      <!--年视图 - 暂时没用-->
      <div v-if="viewType==='year'" class="year-content">
        <span v-for="(item, index) in years" :key="index" @click="yearClick(item)">
          <slot name="year-item" :data="item">{{ item }}</slot>
        </span>
      </div>

      <!--月、周视图-->
      <div class="month-content" :class="animationClass" @touchstart="handleStart" @touchmove="handleMove" @touchend="handleEnd">
        <template v-if="viewType==='month' || viewType==='week'">
          <div v-for="(ms, index) in months" :key="index" class="month-line">
            <template v-if="viewType!=='week' || weekInMonth === index">
              <span v-for="(item, idx) in ms" :key="idx" :class="'current_'+item.current" @click="dayClick(item)">
                <div class="month-light" :class="{'currentday': lightIf(item, currentDay), 'selectday': lightIf(item, selected)}">
                  <div>{{ item.date }}</div>
                  <slot name="item-extra" :data="item"></slot>
                </div>
              </span>
            </template>
          </div>
        </template>
      </div>

      <!--上、下箭头-->
      <van-divider v-if="viewType==='month'" :style="dividerStyle" @click="viewTypeChange('week')">
        <svg-icon icon-class="calendar-up" style="font-size: 24px;" />
      </van-divider>
      <van-divider v-if="viewType==='week'" :style="dividerStyle" @click="viewTypeChange('month')">
        <svg-icon icon-class="calendar-down" style="font-size: 24px;" />
      </van-divider>
    </template>
  </div>
</template>

<script>
import dayjs from 'dayjs'
export default {
  name: 'CalendarComponent',
  props: {
    // 最大日期
    maxDate: {
      type: [String, Date],
      default: () => ''
    },
    // 最小日期
    minDate: {
      type: [String, Date],
      default: () => ''
    },
    // 初始日期
    initDate: {
      type: [String, Date],
      default: () => ''
    },
    // 视图 week,month,year
    initViewType: {
      type: String,
      default: 'month'
    },
    // 判定移动距离
    swipeWidth: {
      type: Number,
      default: () => document.documentElement.clientWidth / 5
    },
    // 日历是否展示
    calendarShow: {
      type: Boolean,
      default: false
    },
    // 日期切换是否展示
    dateSwitchShow: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      dayjs,
      weekdays: ['日', '一', '二', '三', '四', '五', '六'],
      viewType: '', // 视图类型
      flag: '', // 标杆日期
      animationClass: '', // 过渡动画
      weekInMonth: 0, // 当前周是本月的第几周
      firstInMonth: '', // 本月第一天
      lastInMonth: '', // 本月最后一天
      allYears: [], // 所有年份，暂时没用
      years: [], // 一个面板上显示的年份
      months: [[]], // 一个面板上显示的天
      swipeObject: { // 滑动事件
        handled: false, // 是否已触发
        startX: 0, // 起始x位置
        moveX: 0 // 移动x距离
      },
      dividerStyle: {
        color: '#eee',
        borderColor: '#eee',
        paddingBottom: '10px'
      },
      selected: {
        year: 0,
        month: 0,
        date: 0
      }, // 当前选择的日期
      currentDay: null
    }
  },
  mounted () {
    this.viewType = this.initViewType
    this.init()
  },
  methods: {
    // 兼容string和date
    realTime (str) {
      return typeof str === 'string' ? new Date(str) : str
    },
    // 构建数组
    genArr (m, n) {
      return Array.from({ length: m - n + 1 }, (v, k) => k + n)
    },
    // 获取某一天是周几
    getDay (str) {
      str = this.realTime(str)

      return this.weekdays[str.getDay()]
    },
    // 获取某一个月的总天数
    getDaysPerMonth (year, month) {
      return new Date(year, month, 0).getDate()
    },
    // 时间转对象
    time2Object (time) {
      time = this.realTime(time)

      return {
        year: time.getFullYear(), // 年
        month: time.getMonth() + 1, // 月
        date: time.getDate(), // 日
        day: time.getDay(), // 星期
        hour: time.getHours(), // 时
        minutes: time.getMinutes(), // 分
        second: time.getSeconds() // 秒
      }
    },
    // 对象转时间
    object2Time (obj) {
      return new Date(`${obj.year}/${obj.month}/${obj.date}`)
    },
    // 天数拆成周
    days2weeks (days) {
      const num = this.weekdays.length
      const len = days.length / num
      const res = []

      for (let i = 0; i < len; i++) {
        res.push(days.slice(i * num, (i + 1) * num))
      }

      return res
    },
    // 展示周
    formatWeek () {
      const arr = this.months[this.weekInMonth] || []
      return arr.length ? dayjs(this.object2Time(arr[0])).format('MM月DD') + ' - ' + dayjs(this.object2Time(arr[arr.length - 1])).format('MM月DD') : ''
    },
    // add date
    addDay (time, days) {
      time = this.realTime(time)
      time = time.getTime() + days * 24 * 60 * 60 * 1000

      return new Date(time)
    },
    // 选择年
    yearClick (year) {
      this.$emit('click-year', year, this.flag)
    },
    // 选择天
    dayClick (day) {
      this.selected = day
      this.$emit('click-day', day, this.flag)
    },
    // 周/月 视图改变
    viewTypeChange (type) {
      this.viewType = type
      this.$emit('type-change', type)
    },
    // 切换月/周
    changeView (type) {
      this.viewType = type
      this.flag = new Date()

      this.initView(this.flag)
      this.$emit('type-change', type)
    },
    // 左右箭头
    narrowClick (m) {
      switch (this.viewType) {
        case 'month':
          this.addMonth(m)
          break
        case 'week':
          this.addWeek(m)
          break
      }
      this.$emit('narrow-click', m)
    },
    // 下m个月的1号
    firstDayOfMonth (flag, m) {
      const obj = this.time2Object(flag)
      const time = this.realTime(flag)

      time.setMonth(obj.month + m - 1)
      time.setDate(1)

      return new Date(time)
    },
    // 增减月
    addMonth (m) {
      // let obj = this.time2Object(this.flag)
      // this.flag = this.addDay(this.flag, m * this.getDaysPerMonth(obj.year, obj.month))

      this.flag = this.firstDayOfMonth(this.flag, m)

      this.initView(this.flag, m)
    },
    // 增减周
    addWeek (m) {
      const totalWeek = this.months.length

      const temp = this.weekInMonth + m
      if (temp >= 0 && temp < totalWeek) {
        this.weekInMonth = temp
        this.addAnimation(m)
        return
      }

      const mon = m < 0 ? this.firstInMonth : this.lastInMonth
      this.flag = this.addDay(this.object2Time(mon), m)

      this.initView(this.flag, m)
    },
    // 加过渡动画
    addAnimation (m) {
      this.$nextTick(() => {
        this.animationClass = m > 0 ? 'animate__fadeInRight animate__animated' : 'animate__fadeInLeft animate__animated'
        setTimeout(() => {
          this.animationClass = ''
        }, 500)
      })
    },
    // touchStart
    handleStart (evt) {
      evt = evt.targetTouches ? evt.targetTouches[0] : evt
      this.swipeObject.startX = evt.pageX
      this.swipeObject.handled = false
    },
    // touchMove
    handleMove (evt) {
      if (!this.swipeObject.handled) {
        evt = evt.targetTouches ? evt.targetTouches[0] : evt
        this.swipeObject.moveX = evt.pageX - this.swipeObject.startX

        if (Math.abs(this.swipeObject.moveX) > this.swipeWidth) {
          this.swipeObject.handled = true
          if (this.viewType === 'month') {
            this.addMonth(this.swipeObject.moveX < 0 ? 1 : -1)
          } else {
            this.addWeek(this.swipeObject.moveX < 0 ? 1 : -1)
          }
        }

        evt.preventDefault && evt.preventDefault()
      }
    },
    // touchEnd
    handleEnd () {
      this.swipeObject.handled = false
    },
    // 初始化
    init () {
      this.flag = this.initDate || new Date()
      const max = this.maxDate || new Date('2100-01-01')
      const min = this.minDate || new Date('1970-01-01')

      const ya = max.getFullYear()
      const yi = min.getFullYear()
      this.allYears = this.genArr(ya, yi)
      this.currentDay = this.time2Object(this.flag)
      this.initView(this.flag)
    },
    // 填充整月的前后空白
    fillMonths (ms) {
      let st = ms[0]
      let time = this.object2Time(st)
      st = this.time2Object(time).day
      if (st > 0) {
        ms = this.genArr(st - 1, 0).reverse().map(item => this.time2Object(this.addDay(time, -(item + 1)))).concat(ms)
      }

      st = ms[ms.length - 1]
      time = this.object2Time(st)
      st = this.time2Object(time).day
      if (st < 6) {
        ms = ms.concat(this.genArr(6 - st - 1, 0).map(item => this.time2Object(this.addDay(time, item + 1))))
      }

      return ms
    },
    // 获取flag在当前月的第几周
    getWeekInMonth (ms) {
      const fo = this.time2Object(this.flag)
      for (let i = 0; i < ms.length; i++) {
        if (ms[i].year === fo.year &&
          ms[i].month === fo.month &&
          ms[i].date === fo.date) {
          let m = Math.floor((i + 1) / 7)

          if (m > ms.length / 7 - 1) {
            m = ms.length / 7 - 1
          }
          if (m < 0) { m = 0 }

          this.weekInMonth = Math.max(m - 2, 0) // 默认切换到上一周
          break
        }
      }
    },
    // 获取某一月的全部天数
    getDaysInMonth (date) {
      const obj = this.time2Object(date)
      const days = this.getDaysPerMonth(obj.year, obj.month)

      return this.genArr(days, 1).map((item) => {
        return {
          year: obj.year,
          month: obj.month,
          date: item,
          current: true
        }
      })
    },
    // 初始化视图
    initView (date, m) {
      const obj = this.time2Object(date)

      switch (this.viewType) {
        case 'week':
        case 'month':
          let ms = this.getDaysInMonth(date)

          this.firstInMonth = ms[0]
          this.lastInMonth = ms[ms.length - 1]

          ms = this.fillMonths(ms)
          this.months = this.days2weeks(ms)

          // 获取flag在当前月的第几周
          if (this.viewType === 'week') {
            this.getWeekInMonth(ms)
          }
          break
        case 'year':
          let year = Math.max(obj.year, this.allYears[0])
          year = Math.min(obj.year, this.allYears[this.allYears.length - 1])

          this.years = this.genArr(year, year + 12)
          break
      }

      this.slideChange(date)

      m && this.addAnimation(m)
    },
    // 是否高亮当天或选择的日期
    lightIf (item, obj) {
      return item.date === obj.date && item.month === obj.month && item.year === obj.year && item.current
    },
    // 月份变换
    slideChange (date) {
      this.$emit('change', this.dayjs(date))
    },
    // 获取当前 head-info 里显示的时间范围
    getDaysRegion (type) {
      type = type || this.viewType

      if (type === 'week') {
        return this.months[this.weekInMonth]
      }

      if (type === 'month') {
        return this.getDaysInMonth(this.flag)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .calendar-wrap {
    overflow-x: hidden;
    .head-info {
      display: flex;
      padding: 0 10px 0 20px;
      .short-cut {
        padding: 7px 0 8px;
        display: flex;
        flex: unset;
        a {
          background: #F6F8FA;
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #999999;
          line-height: 20px;
          padding: 4px 19px;
          &.active {
            background: #5E6988;
            color: #fff;
          }
          &:first-child {
            border-radius: 3px 0 0 3px;
          }
          &:last-child {
            border-radius: 0 3px 3px 0;
          }
        }
      }
      .show-time {
        flex: 1;
        text-align: right;
        .icon-arrow {
          font-size: 14px;
          margin: 14px 10px 0;
        }
      }
    }
    .week-title {
      height: 21px;
      font-size: 15px;
      font-weight: 500;
      color: #333333;
      line-height: 21px;
      padding: 12px 5px;
      border-bottom: 1px solid #eee;
      font-family: PingFangSC-Medium, PingFang SC;
    }
    .week-title, .month-line {
      display: flex;
      span {
        flex: 1;
        text-align: center;
      }
    }
    .month-line {
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      font-size: 16px;
      padding: 0 5px;
      span {
        color: #cccccc;
        line-height: 21px;
        margin: 8px 0 10px;
        &.current_true {
          color: #333333;
        }
      }
    }

    .month-light {
      max-width: 42px;
      margin: 0 auto;
      border-radius: 4px;
      padding: 2px;

      &.currentday {
        border: 2px solid #1677FF;
        padding: 0;
      }

      &.selectday {
        background: #1677FF;
        color: #fff;
      }
    }

    .van-divider {
      margin: 10px 0 5px;
    }
  }
</style>
