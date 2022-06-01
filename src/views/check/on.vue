<template>
  <div class="fw-container middle-content checkonpage">
    <div class="user">
      <!-- 用户信息 -->
      <div class="flex-box">
        <van-image fit="cover" round v-if="userData && userData.avatar" :src="userData.avatar" class="user-avatar" />
        <van-image fit="cover" round v-else :src="require('@/assets/top-kf.png')" class="user-avatar" />
        <div class="user-info">
          <p class="user-info-name">{{ userData && userData.name }}</p>
          <p class="user-info-branch" v-if="userData.staff_type === 1">
            所属组织：{{ userData && userData.dep_name || 'xxx' }}
          </p>
        </div>
      </div>
      <!-- 切换天 -->
      <div class="flex-box switch">
        <span class="switch-item" :class="{'switch-active': switchType==='yesterday'}" @click="switchTap('yesterday')">昨天</span>
        <span class="switch-item" :class="{'switch-active': switchType==='today'}" @click="switchTap('today')">今天</span>
      </div>
    </div>

    <!-- 打卡内容 -->
    <div class="check check-on">
      <!-- 无需打卡 -->
      <div v-if="planList.length===0" class="check-no">
        <div class="check-no-content">
          <van-image width="190" height="136" fit="cover" :src="require('@/assets/ui-prettify/check-no.png')" />
          <span class="check-no-content-text">你无需打卡，请享受你的休息时光</span>
        </div>
      </div>

      <!-- 需打卡 -->
      <div v-else class="check-content">
        <div v-for="(itm,idx) in planList" :key="idx" style="padding-top:22px;">
          <div class="term_name">{{ itm.term_name }}</div>
          <!-- 上班时间 -->
          <div v-for="(item,index) in itm.clock_info" :key="index">
            <div class="check-time">
              <svg-icon v-if="item.check_in_time" class="check-checkedicon" icon-class="checked" />
              <span v-else class="check-circle" :class="{'check-circle-current': isPassedTime(compTimeStamp(item.start_time))}"></span>
              <span class="check-time-text">上班时间 {{ dayjs(compTimeStamp(item.start_time)).format('HH:mm') }}</span>
              <span v-if="item.check_in_time" class="check-time-clocked">{{ dayjs(compTimeStamp(item.check_in_time)).format('HH:mm') }}已打卡</span>
              <span v-if="getStatusItem(item.start_status)" class="check-time-tag" :class="statusClassMap[item.start_status]">{{ getStatusItem(item.start_status).label }}</span>
            </div>
            <!-- 上班打卡 -->
            <div v-if="getConfig(item).isCurrent&&getConfig(item).isOn&&getConfig(item).needCheckIn&&!item.check_in_time" class="check-main check-line flex-column-box">
              <!-- 打卡 -->
              <div class="check-clock flex-column-box" :class="{'gray-check':!inLocation, 'yellow-check': getConfig(item).isOnLate && inLocation}" @click="doCheck(item)">
                <a class="check-main-text">{{ getConfig(item).isOnLate?'迟到打卡':'上班打卡' }}</a>
                <p class="check-main-time">{{ dayjs(currentTime).format('HH:mm:ss') }}</p>
              </div>
              <!-- 定位位置 -->
              <div class="check-location">
                <van-icon name="location" color="#D1D0D7"/>
                <span v-if="inLocation" class="check-location-tips">你已进入考勤范围</span>
                <span v-else class="check-location-tips">{{ locationErr?locationErr:`你不在考勤范围内 ${configedDistance}米范围内可打卡` }}</span>
              </div>
            </div>

            <!-- 左侧线 -->
            <div v-else class="check-empty-line"></div>

            <!-- 下班时间 -->
            <div class="check-time">
              <svg-icon v-if="item.check_out_time" class="check-checkedicon" icon-class="checked" />
              <span v-else class="check-circle" :class="{'check-circle-current': isPassedTime(compTimeStamp(item.end_time))}"></span>
              <span class="check-time-text">下班时间 {{ dayjs(compTimeStamp(item.end_time)).format('HH:mm') }}</span>
              <span v-if="item.check_out_time" class="check-time-clocked">{{ dayjs(compTimeStamp(item.check_out_time)).format('HH:mm') }}已打卡</span>
              <span v-if="getStatusItem(item.end_status)" class="check-time-tag" :class="statusClassMap[item.end_status]">{{ getStatusItem(item.end_status).label }}</span>
            </div>

            <!-- 下班打卡 -->
            <div v-if="getConfig(item).isCurrent&&getConfig(item).isOff&&getConfig(item).needCheckOut" class="check-main flex-column-box" :class="{'check-line':idx < planList.length - 1}">
              <!-- 打卡 -->
              <div class="check-clock flex-column-box" :class="{'gray-check':!inLocation, 'yellow-check':getConfig(item).isOffEarly && inLocation}" @click="doCheck(item)">
                <a class="check-main-text">{{ getConfig(item).isOffEarly?'早退打卡':'下班打卡' }}</a>
                <p class="check-main-time">{{ dayjs(currentTime).format('HH:mm:ss') }}</p>
              </div>
              <!-- 定位位置 -->
              <div class="check-location">
                <van-icon name="location" color="#D1D0D7"/>
                <span v-if="inLocation" class="check-location-tips">你已进入考勤范围</span>
                <span v-else class="check-location-tips">{{ locationErr?locationErr:`你不在考勤范围内 ${configedDistance}米范围内可打卡` }}</span>
              </div>
            </div>
            <!-- 左侧线 -->
            <div v-else-if="idx < planList.length - 1" class="check-empty-line"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import wx from 'weixin-js-sdk'
import { mapGetters } from 'vuex'
import { isApp } from '@/utils/index'
import { staffGroupDistance, staffSchedulePlanList, staffScheduleClockAdd } from '@/api/check'

export default {
  name: 'CheckOn',
  data () {
    return {
      dayjs,
      switchType: 'today',
      inLocation: false, // 是否在可打卡范围内
      locationErr: '',
      location: {
        longitude: '',
        latitude: ''
      },
      currentTime: Date.now(),
      configedDistance: 200,
      planList: [],
      serverTime: parseInt(Date.now()),
      statusClassMap: {
        1: '',
        2: 'yellow',
        3: 'red',
        4: '',
        5: 'yellow',
        6: 'red'
      },
      lastLocationTime: Date.now(),
      locationTimer: null
    }
  },
  computed: {
    ...mapGetters([
      'userData',
      'appConfig'
    ])
  },
  created () {
    wx.ready(() => {
      sessionStorage.setItem('hasWxReady', '1')
      this.doGetLocation()
    })
  },
  mounted () {
    this.init()
  },
  beforeDestroy () {
    if (this.locationTimer) {
      clearTimeout(this.locationTimer)
    }
  },
  methods: {
    // 初始化
    init () {
      this.doGetLocation()
      this.startTimer()
      this.doGetStaffSchedulePlanList()
    },

    // 获取配置项 是否为当前节点、上班签到状态、迟到状态、下班签到状态、早退状态
    // 图示地址：https://pms-static.gmtech.top/pubsrv/2020920/9f8c1a76-fb32-11ea-9b81-5254000429c2.png
    getConfig (planData) {
      const isCurrent = this.serverTime > this.compTimeStamp(planData.last_end_time) && this.serverTime < this.compTimeStamp(planData.next_split_time) // 当前节点
      const isOn = this.serverTime > this.compTimeStamp(planData.last_end_time) && this.serverTime < this.compTimeStamp(planData.split_time) // 上班签到
      const needCheckIn = planData.check_in === 1
      const isOnLate = this.serverTime > this.compTimeStamp(planData.check_in_end_time) // 迟到
      const isOff = this.serverTime > this.compTimeStamp(planData.split_time) && this.serverTime < this.compTimeStamp(planData.next_split_time) // 下班签到
      const isOffEarly = this.serverTime < this.compTimeStamp(planData.check_out_start_time) // 早退
      const needCheckOut = planData.check_out === 1
      return {
        isCurrent,
        isOn,
        isOnLate,
        isOff,
        isOffEarly,
        needCheckIn,
        needCheckOut
      }
    },

    // 获取状态item
    getStatusItem (status) {
      if (!this.appConfig || !this.appConfig.SCHEDULE_CHECK_STATUS) { return }

      return this.appConfig.SCHEDULE_CHECK_STATUS.find(item => {
        return item.value === status
      })
    },

    // 是否已经过了当前时间
    isPassedTime (time) {
      return time < this.serverTime
    },

    // 排班计划
    doGetStaffSchedulePlanList () {
      const data = {
        date: this.switchType === 'today' ? dayjs().format('YYYY-MM-DD') : dayjs().subtract(1, 'day').format('YYYY-MM-DD')
      }
      staffSchedulePlanList(data).then(res => {
        if (res.code === 200) {
          // console.error('当日打卡', res.data)
          this.planList = res.data.list || []
          this.serverTime = this.compTimeStamp(res.data.now_time)
        } else {
          this.$toast(res.msg)
        }
      })
    },

    // 获取当前时间
    startTimer () {
      this.currentTime = Date.now()

      if (this.locationTimer) {
        clearTimeout(this.locationTimer)
      }

      this.locationTimer = setTimeout(() => {
        this.startTimer()
        // 每隔10秒获取一次当前位置
        if (this.currentTime - this.lastLocationTime > 10000) {
          this.doGetLocation()
          this.lastLocationTime = this.currentTime
        }
      }, 1000)
    },

    // 获取位置信息
    doGetLocation () {
      // if (sessionStorage.getItem('hasWxReady')) {
      console.log('doGetLocation --- ')
      if (isApp()) {
        this.nativeGetLocation((res) => {
          if (res.error) {
            this.$toast(res.error)
            return
          }

          this.location.longitude = +res.longitude
          this.location.latitude = +res.latitude
          this.isInLocation()
        })
      } else {
        wx.getLocation({
          type: 'gcj02',
          success: (res) => {
            console.log(res, 'location')
            this.location.longitude = +res.longitude
            this.location.latitude = +res.latitude
            this.isInLocation()
            console.log('wxgetlocation --- ' + res.longitude)
          },
          cancel: (res) => {
            this.inLocation = false
            this.locationErr = '定位失败，权限不足'
            console.log('定位失败，权限不足')
          }
        })
      }
      // }
    },

    // 是否在可打卡范围内
    isInLocation () {
      staffGroupDistance(this.location).then(res => {
        if (res.code === 200) {
          this.configedDistance = res.data.conf_distance || 200
          if (res.data && res.data.distance <= this.configedDistance) {
            this.inLocation = true
          } else {
            this.inLocation = false
          }
        } else {
          this.inLocation = false
          this.$toast(res.msg || '获取数据失败')
        }
      })
    },

    // 日期切换 重新请求接口数据
    switchTap (type) {
      this.switchType = type
      this.doGetStaffSchedulePlanList()
    },

    // 上班打卡 所有打卡请求参数一致 后端逻辑判断
    doCheck (record) {
      console.log(record)
      if (!this.inLocation) {
        return
      }
      const data = {
        ...this.location,
        clock_id: record.id,
        clock_type: this.getConfig(record).isOn ? 1 : 2
      }
      console.log(data)
      staffScheduleClockAdd(data).then(res => {
        if (res.code === 200) {
          // 签卡成功
          this.$toast('签卡成功')
          this.doGetStaffSchedulePlanList()
        } else {
          this.$toast(res.msg)
        }
      })
    }
  }
}
</script>

<style type="text/css" lang="scss" scoped>
  .checkonpage {
    padding: 10px;
    box-sizing: border-box;
    background-color: #F3F4F8;
    min-height: calc(100vh - 44px);
    font-family: PingFangSC-Regular, PingFang SC;

    .flex-box {
      display: flex;
      align-items: center;
    }

    .flex-column-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .user {
      padding: 10px;
      box-sizing: border-box;
      background-color: #fff;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-radius: 6px;

      &-avatar {
        width: 40px;
        height: 40px;
        border-radius: 20px;
        margin-right: 10px;
      }

      &-info {
        &-name {
          font-size: 16px;
          color: #333;
          line-height: 22px;
        }

        &-branch {
          font-size: 12px;
          color: #bdbdbd;
          line-height: 16px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          width: 175px;
        }
      }
    }

    .switch {
      &-item {
        font-size: 14px;
        color: #999;
        font-weight: 400;
        line-height: 20px;
        padding: 4px 12px;
        background-color: #F6F8FA;

        &:first-child {
          border-radius: 3px 0 0 3px;
        }

        &:last-child {
          border-radius: 0 3px 3px 0;
        }
      }

      &-active {
        background-color: #5E6988;
        color: #fff;
      }
    }

    .gray-check {
      background: #D0D0D0;

      &::after {
        border-color: rgba(208, 208, 208, 0.3);
      }
    }

    .svg-icon {
      font-size: 12px;
      z-index: 2;
    }

    .check-on {
      min-height: calc(100vh - 135px);
    }
  }
  .check-no {
    padding-top: 90px;

    &-content {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;

      &-text {
        font-size: 13px;
        color: #cdcdcd;
        line-height: 19px;
        margin-top: 25px;
      }
    }
  }
  .term_name{
    font-size: 15px;
    font-weight: 700;
    padding-bottom: 15px;
  }
</style>
