<template>
  <div>
    <van-field
      v-model="model[opt.code + '_good_bad']"
      clickable
      :name="opt.code + '_good_bad'"
      class="fw-field bdn light-title"
      input-align="right"
      :label="formLabel(opt)"
      :readonly="true"
      :placeholder="formLabel(opt, '请选择')"
      :required="formRequired(opt)"
      :rules="formRules(opt, '请选择')"
    >
    </van-field>

    <div class="slot-preview">
      <div class="tr feedback" style="font-weight: normal;">
        <span class="title">对结果是否满意？</span>
        <span v-if="model[opt.code + '_good_bad'] == 1" class="dissatisfied current">不满意</span>
        <span v-if="model[opt.code + '_good_bad'] == 5" class="satisfied current">满意</span>
      </div>
    </div>
  </div>
</template>

<script>
import mixin from '../mixin'

export default {
  name: 'FwSatisfiedAppraiseDetail',
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
  data () {
    return {}
  }
}
</script>

<style lang="scss" scoped>
  .light-title {
    padding-bottom: 4px !important;margin-bottom: 0 !important;
    background: transparent;
    ::v-deep &.van-field {
      padding-top: 0 !important;margin: 0 -16px;
      .van-field__label, .van-field__value {
        font-size: 13px;
        font-weight: 400;
        color: #999999;
        line-height: 17px;
        .van-field__control {
          display: none;
        }
      }
      .van-field__label {
        width: auto;
        color: #666;
        font-size: 14px;
      }
      &.van-field--error {
        .van-field__value {
          .van-field__control {
            display: block;
          }
        }
      }
    }
  }

  .slot-preview {
    width: 100%;box-sizing: border-box;text-align: left;font-size: 0;margin-bottom: 12px;
    .feedback {
      font-family: PingFangSC-Regular, PingFang SC;
      .title {
        float: left;
        font-size: 14px;
        font-weight: 400;
        color: #666;
        line-height: 27px;
        text-align: left;
      }
      .satisfied, .dissatisfied{
        font-size: 13px;
        font-weight: 400;
        color: #333333;
        line-height: 27px;
      }
      .dissatisfied {background: url(~@/assets/image/temp/bmy.png);background-size: 85px 27px;width: 85px;height: 27px;display: inline-block;text-align: center;line-height: 27px;text-indent: 16px;;
        &.current { background: url(~@/assets/image/temp/bmy_cur.png) center center no-repeat;background-size: 85px 27px; }
      }
      .satisfied { background: url(~@/assets/image/temp/my.png);background-size: 85px 27px;width: 85px;height: 27px;display: inline-block;text-align: center;line-height: 27px;text-indent: 15px;;
        &.current { background: url(~@/assets/image/temp/my_cur.png) center center no-repeat;background-size: 85px 27px; }
      }
    }
  }
</style>
