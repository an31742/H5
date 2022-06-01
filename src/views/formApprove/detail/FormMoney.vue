<template>
  <div style="text-align: left;border-bottom: 1px solid #EFEFEF;">
    <van-field
      v-model="fieldText"
      clickable
      class="fw-field bdn"
      input-align="right"
      :label="formLabel(opt)"
      :disabled="true"
      format-trigger="onBlur"
      :formatter="(str) => fieldFormatter(str, opt)"
      :required="formRequired(opt)"
      :rules="formRules(opt, '请输入', true)"
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
    <!--<p v-if="formExtra(optProps)" class="form-tips">-->
    <!--{{ formExtra(optProps) }}-->
    <!--</p>-->
  </div>
</template>

<script>
import mixin from '../mixin'
import { convertCurrency } from '@/utils/index'

export default {
  name: 'FormMoney',
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
      fieldText: ''
    }
  },
  computed: {
    optProps () {
      return Object.assign((this.opt.props || {}), { validate: 'number' })
    },
    chineseText () {
      const num = (this.model[this.opt.code] || 0) / 100

      return convertCurrency(num)
    }
  },
  created () {
    this.fieldText = this.getFieldText()

    this.setWatch()
  },
  methods: {
    getFieldText () {
      const unit = this.optProps.unit === '万元' ? 10000 : 1

      return `${this.model[this.opt.code] / 100 / unit}元`
    },

    setWatch () {
      this.$watch(`model.${this.opt.code}`, (val) => {
        this.fieldText = this.getFieldText()
      })
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
      padding: 0 12px 12px;
    }
  }

  ::v-deep .fw-field {
   &.van-cell.van-field {
     padding: 17px 16px;
     box-sizing: border-box;
     display: flex;
     align-items: center;
     justify-content: space-between;
     line-height: 19px;
     border-bottom: 1px solid #EFEFEF;
     &.rich {
       display: block;
       .van-field__control {
         margin-top: 5px;
       }
       .van-field__label {
         width: 100%;
       }
     }
     .van-field__label {
       color: #333;
     }
     .van-field__control {
       color: #999;
       -webkit-text-fill-color: #999;
     }
   }
  }
</style>
