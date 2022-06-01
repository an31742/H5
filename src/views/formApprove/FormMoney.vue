<template>
  <FormMoneyView v-if="formReadonly(opt)" :model="model" :opt="opt" />
  <div v-else style="text-align: left;">
    <van-field
      v-model="fieldValue"
      clickable
      class="fw-field bdn"
      input-align="right"
      type="number"
      :name="opt.code"
      :label="formLabel(opt)"
      :disabled="formReadonly(opt)"
      :placeholder="formLabel(opt, '请输入')"
      format-trigger="onBlur"
      :formatter="(str) => fieldFormatter(str, opt)"
      :required="formRequired(opt)"
      :rules="formRules(opt, '请输入', true)"
      @blur="formatMoney(true)"
    >
      <template #extra>
        <span class="unit">{{ optProps.unit }}</span>
      </template>
    </van-field>
    <!--大写-->
    <div v-if="optProps.showRMB" class="chinese">
      大写：{{ chineseText }}
    </div>
    <!--填写提示-->
    <p v-if="optProps && optProps.extra" class="form-tips">
      {{ optProps.extra }}
    </p>
  </div>
</template>

<script>
import mixin from './mixin'
import { convertCurrency } from '@/utils/index'
import FormMoneyView from './detail/FormTextView'

export default {
  name: 'FormMoney',
  components: {
    FormMoneyView
  },
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
      fieldValue: null
    }
  },
  computed: {
    optProps () {
      return Object.assign(this.opt.props, { validate: 'number' })
    },
    chineseText () {
      let num = this.fieldValue || 0

      num = this.optProps.unit === '万元' ? num * 10000 : num

      return convertCurrency(num)
    }
  },
  created () {
    // 填充默认值
    let val = this.formDefaultValue(this.opt)
    if (val >= 0) {
      val = val / 100 // 分转成元
      this.fieldValue = val / (this.optProps.unit === '万元' ? 10000 : 1)

      this.formatMoney(true)
    }
  },
  methods: {
    formatMoney (flag) {
      const rate = this.optProps.unit === '万元' ? 10000 : 1
      const fen = flag ? 100 : 1 // 转成分

      this.$set(this.model, this.opt.code, parseInt(this.fieldValue * rate * fen, 10))
      this.$set(this.model, this.opt.code + '_desc', this.chineseText)
    }
  }
}
</script>

<style scoped lang="scss">
  ::v-deep {
    .van-field {
      .van-field__control {
        line-height: inherit !important;
      }
    }
    .van-field__error-message {
      text-align: right;
      opacity: .6;
    }
    .van-field--error {
      &.van-field {
        .van-field__control {
          color: red;
        }
      }
    }
    .unit {
      font-size: 14px;
      color: #999999;
      padding-left: 5px;
    }
    .chinese {
      font-size: 14px;
      font-weight: 400;
      color: #666666;
      line-height: 20px;
      background: #fff;
      margin-top: -12px;
      margin-bottom: 12px;
      padding: 0 12px 12px;
    }
  }
</style>
