<template>
  <div class="fw-container detailpage">
    <!--日历插件-->
    <calendar ref="cal" :dateSwitchShow="true" :init-date="initDate" @type-change="getWorkSummary" @narrow-click="getWorkSummary"></calendar>

    <div class="detail">
      <!--用户信息-->
      <div class="user">
        <div class="user-info">
          <img v-if="userData && userData.avatar" :src="userData.avatar" class="user-avatar">
          <img v-else src="~@/assets/top-kf.png" class="user-avatar">
          <span class="user-name">{{ userData && userData.name }}</span>
        </div>
        <p class="user-branch" v-if="userData.staff_type === 1">
          所属组织：{{ userData && userData.dep_name || 'xxx' }}
        </p>
      </div>

      <!--统计信息-->
      <div class="content">
        <div v-for="(item, index) in titleList" :key="index" class="item">
          <van-cell :title="item.title" is-link @click="itemClick(item, index)">
            <slot v-if="item.value" name="default">
              <span :style="{color: item.value.color}">{{ item.value.value }}</span>
            </slot>
          </van-cell>

          <div v-if="index === active" class="reveal">
            <!-- 平均工时规则 判断为平均工时 -->
            <p v-if="item.explain" class="reveal-rule">{{ item.explain }}</p>
            <p v-for="(childItem, childIndex) in item.children" :key="childIndex" class="reveal-time" :class="{'between': childItem.day}">
              <!-- 日期时间 -->
              <span v-if="childItem.date">{{ childItem.date }}</span>
              <!--星期-->
              <span v-if="childItem.weekday">（{{ childItem.weekday }}）</span>
              <!-- 小时 -->
              <span v-if="childItem.hour">{{ childItem.hour }}小时</span>
              <!-- 次数 -->
              <span v-if="childItem.term_num">{{ childItem.term_num }}次</span>

              <!-- 说明 -->
              <span v-if="childItem.explain" class="reveal-explain">{{ childItem.explain }}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import calendar from '../components/calendar'
import { staffScheduleReport } from '@/api/check'
import dayjs from 'dayjs'

export default {
  name: 'CheckDetail',
  components: {
    calendar
  },
  data () {
    return {
      active: '',
      initDate: new Date(),
      titleList: [],
      titles: [
        {
          title: '平均工时',
          valueFormat: {
            key: 'average_seconds',
            extra: '小时'
          },
          children: [],
          key: 'average_work',
          explain: '平均工时=打卡工时/打卡天数'
        },
        {
          title: '出勤天数',
          valueFormat: {
            key: 'days',
            extra: '天'
          },
          children: [],
          key: 'schedule_day'
        },
        {
          title: '出勤班次',
          valueFormat: {
            key: 'term_num',
            extra: '次'
          },
          children: [],
          key: 'schedule_term'
        },
        {
          title: '休息天数',
          valueFormat: {
            key: 'term_num',
            extra: '天'
          },
          children: [],
          key: 'rest_day'
        },
        {
          title: '迟到',
          valueFormat: {
            key: 'term_num',
            extra: '次',
            color: '#FA5151'
          },
          children: [],
          key: 'late_term'
        },
        {
          title: '早退',
          valueFormat: {
            key: 'term_num',
            extra: '次',
            color: '#FA5151'
          },
          children: [],
          key: 'early_term'
        },
        {
          title: '缺卡',
          valueFormat: {
            key: 'term_num',
            extra: '次',
            color: '#FA5151'
          },
          children: [],
          key: 'omit_term'
        },
        {
          title: '旷工',
          valueFormat: {
            key: 'term_num',
            extra: '次',
            color: '#FA5151'
          },
          children: [],
          key: 'absence_term'
        }
      ],
      nowDate: ''
    }
  },
  computed: {
    ...mapGetters([
      'userData'
    ])
  },
  created () {
    this.titleList = JSON.parse(JSON.stringify(this.titles))
    this.initDate = this.$route.query.date || this.initDate

    this.$nextTick(() => {
      this.getWorkSummary()
    })
  },
  methods: {
    // 获取cell的value格式
    getItemValue (opt, item, key) {
      let value = `${item[opt.key]}`
      value = key === 'average_work' ? (value / 3600).toFixed(2) : value
      value = `${value}${opt.extra}`
      const color = item[opt.key] > 0 ? (opt.color || '#333333') : '#D0D0D0'

      return { value, color }
    },
    // 时间对象转字符串时间
    timeObject2String (obj) {
      return `${obj.year}-${this.formatZero(obj.month)}-${this.formatZero(obj.date)}`
    },
    // 条目展开
    itemClick (item, index) {
      if (!item.children || !item.children.length) {
        this.$toast(`暂无${item.title}信息`)
        return
      }

      this.active = index
    },
    // 迟到、早退、缺卡说明
    childItemExplain (list, key) {
      if (['late_term', 'early_term', 'omit_term'].indexOf(key) < 0) {
        return list
      }

      return list.map(item => {
        let explain = ''
        switch (key) {
          case 'late_term': // 迟到
            explain = `上班迟到${item.minutes}分钟`
            break
          case 'early_term': // 早退
            explain = `下班早退${item.minutes}分钟`
            break
          case 'omit_term': // 缺卡
            explain = `上班时间：${this.formatTime(item.should_clock_time)}    上班缺卡`
            if (item.absence_type === 2) {
              explain = `下班时间：${this.formatTime(item.should_clock_time)}    下班缺卡`
            }
            break
        }
        item.explain = explain

        return item
      })
    },
    // 获取排班信息
    getWorkSummary () {
      const arr = this.$refs && this.$refs.cal && this.$refs.cal.getDaysRegion() || []
      const end = this.timeObject2String(arr[arr.length - 1])
      const params = {
        start_date: this.timeObject2String(arr[0]),
        end_date: end
      }

      staffScheduleReport(params).then(res => {
        if (res.code === 200) {
          const data = res.data || {}
          this.active = ''
          this.titleList = this.titleList.map(item => {
            item.value = this.getItemValue(item.valueFormat, data[item.key], item.key)
            item.children = this.childItemExplain(data[item.key].list || [], item.key)
            return item
          })
        } else {
          this.$toast(res.msg || '获取考勤统计信息失败')
        }
      })
    },
    formatZero (t) {
      return t < 10 ? `0${t}` : t
    },
    formatTime (t) {
      return dayjs(this.compTimeStamp(t)).format('HH:ss')
    }
  }
}
</script>

<style type="text/css" lang="scss" scoped>
  .detailpage {
    background-color: #F3F4F8;
    font-family: PingFangSC-Regular, PingFang SC;

    .detail {
      padding: 10px;
      box-sizing: border-box;
    }

    .user {
      background: #fff;
      border-radius: 6px;
      padding: 10px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;

      &-info {
        display: flex;
        align-items: center;
      }

      &-avatar {
        width: 40px;
        height: 40px;
        display: block;
        border-radius: 50%;
      }

      &-name {
        font-size: 16px;
        color: #333;
        font-weight: 400;
        line-height: 22px;
        margin-left: 10px;
      }

      &-branch {
        font-size: 12px;
        color: #bdbdbd;
        line-height: 16px;
        font-weight: 400;
      }
    }

    .content {
      margin-top: 10px;
      background-color: #fff;
      border-radius: 6px;
      padding-top: 8px;
      .item:not(:last-child) {
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      }
    }

    .reveal {
      background: #F7F7F7;
      padding: 0 9px 0 16px;
      box-sizing: border-box;

      &-rule, &-explain {
        font-size: 10px;
        color: #999;
        line-height: 14px;
        font-weight: 400;
        padding: 6px 0;
      }

      &-time {
        font-size: 14px;
        color: #333;
        line-height: 20px;
        font-weight: 400;
        padding: 10px 0;

        &.between {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
      }

      &-explain {
        display: block;
        padding: 4px 0;
      }
    }

    .slide-enter-active, .slide-leave-active {
      transition: all 1s ease;
    }
    .slide-enter, .slide-leave-to {
        height: 0;
    }
  }
</style>
