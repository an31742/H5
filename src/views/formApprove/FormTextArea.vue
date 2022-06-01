<template>
  <FormTextView v-if="formReadonly(opt)" :model="model" :opt="opt" />
  <div v-else class="form" style="text-align: left;">
    <van-field
      v-model="model[opt.code]"
      clickable
      rows="5"
      type="textarea"
      show-word-limit
      format-trigger="onBlur"
      class="fw-field bdn light-title"
      :class="{overSize: model[opt.code] && model[opt.code].length >= (formMaxLength(opt) || 200)}"
      :maxlength="formMaxLength(opt) || 200"
      :name="opt.code"
      :label="formLabel(opt)"
      :disabled="formReadonly(opt)"
      :placeholder="formLabel(opt, '请输入')"
      :formatter="(str) => fieldFormatter(str, opt)"
      :required="formRequired(opt)"
      :rules="formRules(opt, '请输入', true)"
      :error-message="errorMessage"
      @input="handleInput"
    >
    </van-field>
    <p v-if="formExtra(opt)" class="form-tips">{{ formExtra(opt) }}</p>
  </div>
</template>

<script>
import mixin from './mixin'
import FormTextView from './detail/FormTextView'

export default {
  name: 'FormTextArea',
  components: {
    FormTextView
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
    },
    setModel: {
      type: Boolean,
      default: () => true
    }
  },
  data () {
    return {
      errorMessage: ''
    }
  },
  created () {
    // 填充默认值
    if (this.formDefaultValue(this.opt)) {
      const val = this.formDefaultValue(this.opt)

      this.$set(this.model, this.opt.code, val)

      this.handleInput(val)
    }
  },
  methods: {
    handleInput (val) {
      this.errorMessage = this.checkInput(val, this.opt)
      this.$emit('input', val)

      if (this.setModel) {
        this.$set(this.model, this.opt.code + '_desc', val)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .light-title {
    background: transparent;padding-bottom: 4px !important;margin-bottom: 0 !important;
    ::v-deep &.van-field {
      padding-top: 0 !important;
      .van-field__label {
        font-size: 13px;
        font-weight: 400;
        color: #999999;
        line-height: 17px;
      }
      .extra {
        padding-left: 20px;
      }
      &.van-field--error {
        .van-field__value {
          .van-field__control {
            display: block;
          }
        }
      }
    }

    ::v-deep &.fw-field {
      &:hover { background: transparent !important; }
      &.van-field--min-height {
        padding: 0 !important;
        margin-bottom: 12px !important;
        ::-webkit-input-placeholder { color: #999;font-size: 14px; }
        .van-field__label, .van-field__value {
          padding: 0 16px;
          margin: 0;
          line-height: 17px;
        }
        .van-field__control { min-height: 40px;background: #fff; }
        .van-cell__value { background: #fff !important;border-radius: 0; }
        .van-field__word-limit { padding: 0 10px 5px 0; }
        .van-field__body { padding: 5px 0 !important;background: #fff }
        &.inner-textarea {
          .van-cell__value { margin-left: 0;margin-right: 0; }
        }
        .van-field__error-message { padding-left: 0 !important; }
        &.van-field--error {
          ::-webkit-input-placeholder { color: #FA5151; }
          .van-field__body { border: none; }
          .van-cell__value { border: none; }
        }
        &.overSize {
          .van-field__word-num {
            color: red;
          }
        }
      }
      .van-field__word-limit {
        float: right;
        position: absolute;
        top: -27px;
        right: 0;
        font-size: 13px;
        color: #999999;
        line-height: 17px;
      }
    }
  }
</style>
