<template>
  <div class="questionCom">
    <van-sticky>
      <van-row>
        <van-col span="20">
          <van-search v-model="params.room_name" @input="onRefresh" placeholder="请输入房屋信息" />
        </van-col>
        <van-col span="4" class="time" @click="openTime">
          <img src="@/assets/image/decoration/time.png" alt="" class="time-img">
          <p>时间</p>
        </van-col>
      </van-row>
    </van-sticky>

    <!--选择日期弹层-->
    <van-calendar
      v-model="popupDateShow"
      color="#E1AA6C"
      row-height="48"
      class="fw-cal-wrap form-component"
      :round="false"
      :show-mark="false"
      :min-date="minDate"
      type="range"
      :formatter="formatter"
      :get-container="getBodyContainer"
      @confirm="selectDate"
    >
    </van-calendar>
    <van-pull-refresh v-model="loading" @refresh="onRefresh">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <van-skeleton slot="loading" title avatar :row="5" :loading="loading"></van-skeleton>
        <template v-if="list.length>0">
          <ul>
            <li v-for="(item,index) in list" :key="index">
              <van-row>
                <van-col span="16" class="name">
                  <p>{{ item.room_name }}</p>
                  <p>{{ dayjs(item.commit_time).format('YYYY-MM-DD  HH:mm') }}</p>
                </van-col>
                <van-col span="8">
                  <van-button color="#E1AA6C" plain @click="viewItem(item)">详情</van-button>
                </van-col>
              </van-row>
            </li>
          </ul>
        </template>
        <div v-if="finished && list.length===0">
          <div class="empty">
            <img src="@/assets/image/decoration/empty.png" alt="" class="empty-img">
          </div>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { historyApplyList } from '@/api/decoration'
import dayjs from 'dayjs'
export default {
  name: 'History',
  data () {
    return {
      params: {
        room_name: ''
      },
      list: [],
      finished: true,
      loading: false,
      popupDateShow: false,
      dayjs,
      minDate: new Date(dayjs(new Date()).add(-1, 'year'))
    }
  },
  created () {
    this.onRefresh()
  },
  methods: {
    // 格式化日期显示
    formatter (day) {
      if (dayjs(day.date).format('YYYY-MM-DD') === dayjs(new Date()).format('YYYY-MM-DD')) {
        day.className = 'current'
      }
      day.bottomInfo = ''

      return day
    },
    openTime () {
      this.popupDateShow = true
    },
    viewItem (item) {
      this.$router.push(`/decoration/historyDetail?id=${item.question_id}`)
    },
    // 选择日期
    selectDate (date) {
      this.popupDateShow = false

      // 日期范围
      if (Array.isArray(date)) {
        const str = dayjs(date[0]).format(this.timeFormat)
        const etr = dayjs(date[1]).format(this.timeFormat)
        this.params.start_time = str
        this.params.end_time = etr
      }
      this.onRefresh()
    },
    // 下拉刷新
    onRefresh () {
      this.page = 1
      this.onLoad(true)
    },

    // 加载数据
    onLoad (flag) {
      const data = {
        ...this.params,
        page: this.page,
        page_size: this.pageSize
      }
      this.loading = true

      historyApplyList(data).then(res => {
        this.loading = false
        if (res.code === 200) {
          if (res.data) {
            const arr = res.data.list || []

            if (!flag) {
              this.list = [...this.list, ...arr]
            } else {
              this.list = [...arr]
            }
            console.log('this.list', this.list)
            this.page++
            this.finished = this.list.length >= res.data.total || !arr.length
          } else {
            this.finished = true
          }
        } else {
          this.$toast(res.msg)
        }
      }).catch(() => {
        this.loading = false
        this.finished = true
      })
    }
  }
}
</script>

<style scoped lang="scss">
.questionCom{
  .van-search__content{
    border-radius: 20px;
  }
  .time{
    text-align: center;
    font-size: 12px;
    color: #333;
    padding-top: 12px;
    box-sizing: border-box;
  }
  .van-row{
    background: #fff;
  }
  .time-img{
    width: 16px;
    height: 16px;
  }
  ul{
    padding: 12px 16px;
    box-sizing: border-box;
    li{
      padding: 22px 12px;
      box-sizing: border-box;
      background: #fff;
      border-radius: 6px;
      margin-bottom: 12px;
      .name{
        p:first-child{
          overflow:hidden;
          text-overflow:ellipsis;
          white-space:nowrap;
          font-size: 15px;
          color: #333333;
        }
        p:last-child{
          font-size: 12px;
          color: #999;
        }
      }
      .van-button{
        width: 80px;
        height: 30px;
        font-size: 14px;
        padding: 0;
        border-radius: 6px;
      }
    }
  }
  .empty{
    text-align: center;
    padding-top: 20px;
    .empty-img{
      width: 200px;
      height: 106px;
    }
  }
}
</style>
