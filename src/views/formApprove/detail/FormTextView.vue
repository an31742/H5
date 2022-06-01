<template>
  <div v-if="showText">
    <van-field
      v-model="showText"
      class="fw-field"
      rows="1"
      autosize
      :input-align="opt.type !== 'FormTextArea' ? 'right' : 'left'"
      :type="opt.type !== 'FormTextArea' ? 'text' : 'textarea'"
      :readonly="true"
      :label="formLabel(opt)"
      :class="{rich: opt.type === 'FormTextArea'}"
    >
    </van-field>
    <!--<p v-if="formExtra(opt)" class="form-tips">{{ formExtra(opt) }}</p>-->
  </div>
</template>

<script>
import mixin from '../mixin'

export default {
  name: 'FormTextView',
  mixins: [mixin],
  props: {
    keyName: {
      type: String,
      default: () => ''
    },
    model: {
      type: Object,
      default: () => {}
    },
    opt: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    showText () {
      let str = this.model[this.opt.code + '_desc'] || this.model[this.opt.code] || ''
      // {} 空对象处理
      if (typeof str === 'object' && JSON.stringify(str) === '{}') {
        return ''
      }

      if (this.keyName) {
        str = this.model[this.keyName] || str
      }

      return Array.isArray(str) ? str.join(',') : str + ''
    }
  }
}
</script>

<style lang="scss" scoped>
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
          max-height: 72px;
        }
        .van-field__label {
          width: 100%;
        }
      }
      .van-field__label {
        color: #333;
        max-width: 50%;
        width: auto;
      }
      .van-field__control {
        color: #999;
      }
    }
  }

  // 只读状态
  .readonly {
    ::v-deep .fw-field.van-field {
      margin-bottom: 0;
    }
  }
</style>
