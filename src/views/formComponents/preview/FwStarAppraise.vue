<template>
  <div style="text-align: left;">
    <FwTextView class="star-title" :model="model" :opt="opt" :keyName="opt.code + '_detail'" />

    <div class="star-wrap">
      <div class="star-item">
        <label>服务质量</label>
        <van-rate
          v-model="model[opt.code + '_service_star']"
          :size="20"
          readonly
          color="#FDD15A"
        ></van-rate>
        <span class="star-tips">
          {{ formatText(model[opt.code + '_service_star']) }}
        </span>
      </div>

      <div class="star-item">
        <label>服务时效</label>
        <van-rate
          v-model="model[opt.code + '_time_star']"
          :size="20"
          readonly
          color="#FDD15A"
        ></van-rate>
        <span class="star-tips">
          {{ formatText(model[opt.code + '_time_star']) }}
        </span>
      </div>

      <div class="star-item">
        <label>服务态度</label>
        <van-rate
          v-model="model[opt.code + '_attitude_star']"
          :size="20"
          readonly
          color="#FDD15A"
        ></van-rate>
        <span class="star-tips">
          {{ formatText(model[opt.code + '_attitude_star']) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import mixin from '../mixin'
import FwTextView from './FwTextView'

export default {
  name: 'FwStarAppraise',
  components: { FwTextView },
  mixins: [mixin],
  props: {
    model: {
      type: Object,
      default: () => {}
    },
    opt: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    // 显示评价提示语
    formatText (str) {
      const obj = {
        '1': '非常不满意',
        '2': '不满意',
        '3': '还行',
        '4': '较满意',
        '5': '非常满意'
      }

      return obj[str] || ''
    }
  }
}
</script>

<style lang="scss" scoped>
  .star-title {
    font-size: 14px;
    color: #333333;
    line-height: 20px;
    padding: 0 16px 11px 16px;
    border-bottom: 1px solid #EFEFEF;
    margin-left: -16px;
    margin-right: -16px;
  }

  .star-wrap {
    font-family: PingFangSC-Regular, PingFang SC;
    background: #fff;
    margin-top: 8px;
    .star-item {
      font-size: 0;
      label {
        font-size: 14px;
        color: #666;
        line-height: 20px;
        padding-right: 15px;
        float: left;
      }
      .star-tips {
        float: right;
        font-size: 13px;
        font-weight: 400;
        color: #999999;
        line-height: 20px;
      }
    }

    ::v-deep .van-rate__item:not(:last-child) {
      margin-right: 12px;
    }
  }
</style>
