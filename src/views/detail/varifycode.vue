<template>
  <div class="fw-container">
    <div class="weui-form-preview customStyle">
      <div class="user-box">
        <svg-icon icon-class="user-on" />
      </div>
      <div class="room-location">
        <div class="room-location-str">{{ visit.room_location_str }}</div>
        <div class="status-room">
          <span v-if="visit.status===0"><svg-icon icon-class="not-visited" /></span>
          <span v-if="visit.status===1"><svg-icon icon-class="on-visited" /></span>
        </div>
      </div>
      <div class="weui-form-preview-box">
        <div class="weui-form-preview-bd">
          <div class="weui-form-preview-item">
            <div class="weui-form-preview-label">
              <svg-icon icon-class="name" />
              <span>姓名</span>
            </div>
            <span class="weui-form-preview-value">{{ visit.visitor_name }}</span>
          </div>
          <div class="weui-form-preview-item">
            <div class="weui-form-preview-label">
              <svg-icon icon-class="tel" /><span>访客电话</span>
            </div>
            <span class="weui-form-preview-value">{{ visit.visitor_mobile }}</span>
          </div>
          <div class="weui-form-preview-item">
            <div class="weui-form-preview-label"><svg-icon icon-class="position" /><span>身份证号</span></div>
            <span class="weui-form-preview-value">{{ visit.visitor_card_id }}</span>
          </div>
          <div class="weui-form-preview-item">
            <div class="weui-form-preview-label"><svg-icon icon-class="date" /><span>到访日期</span></div>
            <span v-if="visit.visit_time" class="weui-form-preview-value">
              {{ dayjs(visit.visit_time).format('YYYY-MM-DD') }}
            </span>
          </div>
          <div class="weui-form-preview-item">
            <div class="weui-form-preview-label"><svg-icon icon-class="reason" /><span>到访原因</span></div>
            <span class="weui-form-preview-value">{{ getReason(visit.reason) }}</span>
          </div>
          <div class="weui-form-preview-item">
            <div class="weui-form-preview-label"><svg-icon icon-class="person" /><span>到访人数</span></div>
            <span class="weui-form-preview-value">{{ visit.num }}</span>
          </div>
        </div>
      </div>
    </div>
    <div v-if="visit.status===0 && statusRight" class="weui-form-preview-ft">
      <div style="height: 1.92rem;"></div>
      <div class="van-submit-bar">
        <div class="fw-btm-wrap">
          <van-button size="large" type="primary" @click="doVerify">确认已到访</van-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { verifyVisitByQrcode } from '@/api/extra'
import { mapGetters } from 'vuex'
import dayjs from 'dayjs'
export default {
  name: 'Varifycode',
  data () {
    return {
      dayjs,
      visit: {},
      statusRight: false,
      code: this.$route.query.fwfkcode || ''
    }
  },
  computed: {
    ...mapGetters([
      'userData',
      'appConfig'
    ])
  },
  created () {
    if (!this.code) {
      this.$toast('无效二维码')
      return
    }
    this.getVisitorInfo()
  },
  methods: {
    // 获取访客原因
    getReason (str) {
      const res = (this.appConfig.VISIT_REASONS || []).filter(item => item.value === str)

      return res[0] ? res[0].label : ''
    },
    // 获取信息
    getVisitorInfo () {
      verifyVisitByQrcode({ qrcode: this.code }).then(res => {
        if (res.code === 200) {
          this.visit = res.data.visit
          this.statusRight = true
        } else {
          this.visit = res.data.visit || {}
          this.$toast(res.msg)
        }
      })
    },
    // 验证
    doVerify () {
      this.$confirm({
        message: '确认访客信息正确！'
      }).then(() => {
        verifyVisitByQrcode({ qrcode: this.code, revoke: 1 }).then(res => {
          if (res.code === 200) {
            this.$toast('操作成功！')
            this.getVisitorInfo()
          } else {
            this.$toast(res.msg)
          }
        })
      }).catch(() => {})
    }
  }
}
</script>

<style scoped lang="scss">
.fw-container{
  .user-box{
    display: flex;
    justify-content: center; /* 水平居中 */
    align-items: center;     /* 垂直居中 */
    background-color: #fff;
    height: 92px;
    width: 92px;
    position: absolute;
    top: -48px;
    border-radius: 50%;
    left:50%;
    transform: translateX(-50%); /*自己的50% */
    .svg-icon{
      width: 80px;
      height: 80px;
    }
  }
  .room-location{
    padding:  50px 20px 15px;
    .room-location-str{
      border-radius: 4px;
      padding:  0 20px;
      height: 40px;
      line-height: 40px;
      background-color:rgba(225,170,108, 0.08);
      color: #BC8D58;
      font-size: 16px;
    }
  }
  .weui-form-preview-bd{
    padding: 0 12px;
    border-radius: 4px;
  }
  .weui-form-preview-item{
    display: flex;
    padding: 6px;
    &:not(:last-child) { border-bottom: 1px solid #e6d3bd; }
    .weui-form-preview-label .svg-icon{
      margin-right: 6px;
    }
    .weui-form-preview-label span{
      font-size: 16px;
      color: #BC8D58;
    }
    .weui-form-preview-value{
      flex: 1;
      font-size: 16px;
      color: #333;
      text-align: right;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .weui-form-preview-box{
    padding:  0 20px 15px;
    border-radius: 4px;
    .weui-form-preview-bd{
      background-color:rgba(225,170,108, 0.08);
    }
  }
}
.weui-form-preview-ft{
  position: fixed;
  width: 100%;
  bottom: 0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}
.weui-form-preview{
  margin: 80px 16px 0;
}
  .customStyle {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }
  .status-room{
    position: absolute;
    right: 10px;
    top: 30px;
    .svg-icon{
      width: 68px;
      height: 48px;
    }
  }
</style>
