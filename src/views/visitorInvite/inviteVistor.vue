<template>
  <div class="content">

    <div class="card">
      <div class="text">姓名: {{ info.visitor_name }} </div>
      <div class="text">联系电话: {{ info.visitor_mobile }} </div>
      <div class="text">适用小区: {{ info.group_name }} </div>
    </div>
    <div class="card">
      <div
        class="tip "
        :class="{'tip2':isTimeOut}"
      >
        {{ isTimeOut?'已过期':'使用中' }}</div>
      <div class="text1">剩余时间</div>
      <div class="time">
        <van-count-down :auto-start="true" :time="countdownTime" :millisecond="false" @finish="countdownFinish()" />
      </div>
    </div>

  </div>
</template>

<script>
import {
  miniVisitInfo
} from '@/api/visitorInvite'
export default {
  name: 'InviteVistor',
  data () {
    return {
      isTimeOut: false,
      expireTimeText: '',
      countdownTime: null,
      info: {
        'expire_time': undefined,
        'group_name': undefined,
        'group_id': undefined,
        'visitor_name': undefined,
        'visitor_mobile': undefined
      }
    }
  },
  async created () {
    this.userId = this.$route.query.userId
    this.shareId = this.$route.query.shareId
    const res = await miniVisitInfo({
      user_id: Number(this.userId),
      share_id: Number(this.shareId)
    })

    if (res.code === 200) {
      this.info = res.data
      this.isTimeOut = false
      // 终止权限
      if (this.info.status === 3) {
        this.countdownFinish()
      } else {
        const now = new Date()
        const visitTime = new Date(this.info.visit_time)
        this.countdownTime = this.info.expire_time * 1000 - (now - visitTime)
      }
    }
  },
  methods: {

    countdownFinish () {
      this.expireTimeText = `00:00:00`
      this.isTimeOut = true
    }
  }
}
</script>

<style lang="scss" scoped>
.content{
  flex:1;
  padding:25px 0 0 0;
  background-image: url(~@/assets/image/pswpagebg.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.card{

  background: #FFFFFF;
  border-radius: 11px;
  padding:10px 22px;
  margin: 16px;

  .text{
    margin:9px 0;

      font-size: 15px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      line-height: 21px;

  }
}

.tip{

  width: 90px;
  height: 33px;
  background: #F0F5FF;
  border-radius: 5px;

  font-size: 18px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #1677FF;
  line-height: 33px;
  letter-spacing: 7px;
  text-indent:7px;
  text-align: center;
  margin: 10px auto;
}
.tip2{

background-color: rgba(255, 77, 79, 0.12);
  color: #FF4D4F;
}

.text1{
    margin-top:35px;
    text-align: center;
    height: 19px;
    font-size: 13px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #999999;
    line-height: 19px;
}
::v-deep .van-count-down{
  font-size: 24px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #333333;
  line-height: 34px;
  letter-spacing: 10px;
  text-indent:10px;
}
.time{
  margin:10px auto 33px auto;
  text-align: center;
  height: 34px;

}
</style>
