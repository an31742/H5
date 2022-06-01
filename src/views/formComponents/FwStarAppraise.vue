<template>
  <div style="text-align: left;">
    <FwTextArea :model="model" :opt="taOption" :setModel="false" @input="(val) => { desc = val; setDesc(); }" />

    <div class="star-wrap">
      <div class="star-item">
        <label>服务质量</label>
        <van-rate
          v-model="model[opt.code + '_service_star']"
          :size="20"
          color="#FDD15A"
          :disabled="formReadonly(opt)"
          @change="setDesc"
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
          color="#FDD15A"
          :disabled="formReadonly(opt)"
          @change="setDesc"
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
          color="#FDD15A"
          :disabled="formReadonly(opt)"
          @change="setDesc"
        ></van-rate>
        <span class="star-tips">
          {{ formatText(model[opt.code + '_attitude_star']) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import mixin from './mixin'
import FwTextArea from './FwTextArea'

export default {
  name: 'FwStarAppraise',
  components: { FwTextArea },
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
    return {
      desc: ''
    }
  },
  computed: {
    // 文本域的opt
    taOption () {
      const obj = JSON.parse(JSON.stringify(this.opt))
      return Object.assign(obj, { code: this.opt.code + '_detail' })
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
    },
    // 描述文案
    setDesc () {
      let str = `${this.opt.name}：${this.desc || ''}；`
      str += `服务质量：${this.model[this.opt.code + '_service_star'] || ''}；`
      str += `服务时效：${this.model[this.opt.code + '_time_star'] || ''}；`
      str += `服务态度：${this.model[this.opt.code + '_attitude_star'] || ''}；`

      this.$set(this.model, this.opt.code + '_desc', str)
    }
  }
}
</script>

<style lang="scss" scoped>
  .star-wrap {
    font-family: PingFangSC-Regular, PingFang SC;
    background: #fff;
    margin-top: -8px;
    padding: 16px;
    margin-bottom: 12px;
    .star-item {
      font-size: 0;
      &:not(:last-child) {
        margin-bottom: 20px;
      }
      label {
        font-size: 14px;
        color: #333333;
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
      margin-right: 20px;
    }
  }
</style>
