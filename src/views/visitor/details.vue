<template>
  <div class="detail-wrapper">
    <div class="container">
      <div class="box">
        <div class="field">
          <div class="label">访客姓名</div>
          <div class="value">{{ info.visitor_name }}</div>
        </div>

        <div class="field">
          <div class="label">访客电话</div>
          <div class="value">{{ info.visitor_mobile }}</div>
        </div>

        <div class="field">
          <div class="label">到访家庭</div>
          <div class="value">{{ info.room_location_str }}</div>
        </div>
      </div>

      <div class="box">
        <div class="field">
          <div class="label">到访人数</div>
          <div class="value">{{ info.num }} 人</div>
        </div>

        <div class="field">
          <div class="label">到访时间</div>
          <div class="value">{{ dayjs(info.visit_time).format('YYYY年MM月DD日 HH:mm') }}</div>
        </div>

        <div class="field">
          <div class="label">通过门禁</div>
          <div class="value">{{ info.device_name }}</div>
        </div>
      </div>

      <div class="box">
        <div class="field">
          <div class="label">证件类型</div>
          <div class="value">{{ visitorCardType }}</div>
        </div>

        <div class="field">
          <div class="label">证件号码</div>
          <div class="value">{{ info.visitor_card_id }}</div>
        </div>

        <div class="field">
          <div class="label">当日体温</div>
          <div class="value">{{ info.temperature }}</div>
        </div>
      </div>

      <div class="box">
        <div class="field">
          <div class="label">到访事由</div>
          <div class="value">{{ reasonName }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { mapGetters } from 'vuex'
export default {
  name: 'VisitorDetails',
  data () {
    return {
      info: {}
    }
  },
  computed: {
    ...mapGetters([
      'appConfig'
    ]),
    reasonName () {
      const reason = this.info.reason
      const res = (this.appConfig.VISIT_REASONS || []).filter(item => item.value === reason)

      return res[0] ? res[0].label : ''
    },
    visitorCardType () {
      const visitorCardType = this.info.visitor_card_type
      const res = (this.appConfig.USER_V2_CERTIFICATE_TYPE_LIST || []).filter(item => item.value === visitorCardType)

      return res[0] ? res[0].label : ''
    }
  },
  created () {
    this.info = JSON.parse(this.$route.query.info)
  },
  methods: {
    ...{
      dayjs
    }
  }
}
</script>

<style lang="scss" scoped>
  .detail-wrapper {
    background: #F6F8FA;
  }
  .container {
    box-sizing: border-box;
    height: 648px;
    padding: 100px 22px 0;
    margin: 12px 16px 0;
    background: url('./images/detail_bg.png') no-repeat;
    background-size: 100% auto;

    .box {
      width: 100%;
      height: 125px;
      margin: 4px 0;
      border-radius: 4px;
      background: #FAF7F4;
      overflow: auto;

      .field {
        display: flex;
        font-size: 15px;
        line-height: 20px;
        margin: 16px 0;
        .label {
          width: 76px;
          text-align: right;
          color: #BC8D58;
        }
        .value {
          width: 191px;
          margin: 0 0 0 16px;
          color: #333;
        }
      }
    }
  }
  .bottom {
    width: 100%;
    height: 80px;
    overflow: auto;
    background: #FFFFFF;
  }
  .visitor-again {
    display: block;
    width: 300px;
    height: 40px;
    margin: 20px auto;
    background: linear-gradient(45deg, #F2D5A5 0%, #E1AA6C 100%);
    border-radius: 20px;
    border: none;
    font-size: 18px;
    font-weight: 500;
    color: #fff;
  }
</style>
