<template>
  <FormTextView v-if="formReadonly(opt)" :model="model" :opt="opt" />
  <div v-else style="text-align: left;">
    <van-field
      v-model="model[opt.code]"
      clickable
      class="fw-field bdn"
      input-align="right"
      format-trigger="onBlur"
      :name="opt.code"
      :label="formLabel(opt)"
      :disabled="formReadonly(opt)"
      :maxlength="formMaxLength(opt)"
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
  name: 'FormInput',
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
      this.$set(this.model, this.opt.code + '_desc', val)
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
  }
</style>
