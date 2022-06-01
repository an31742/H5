<template>
  <FormTextView v-if="formReadonly(opt)" :model="model" :opt="opt" />
  <div v-else>
    <van-field
      v-model="radio"
      clickable
      name="radio"
      class="bdn cell-block"
      input-align="right"
      :label="formLabel(opt)"
      :disabled="formReadonly(opt)"
      :placeholder="formLabel(opt, '请选择')"
      :required="formRequired(opt)"
      :rules="formRules(opt, '请选择')"
    >
      <template #input>
        <van-radio-group v-model="model[opt.code]" :disabled="formReadonly(opt)" direction="vertical" @change="choiceChange">
          <div v-for="(item, index) in opt.props.options" :key="index" class="choice">
            <van-radio
              :name="item.value"
              icon-size="0.4533rem"
              checked-color="#E1AA6C"
            >{{ item.label }}</van-radio>
          </div>
        </van-radio-group>
      </template>
    </van-field>
    <p v-if="formExtra(opt)" class="form-tips">{{ formExtra(opt) }}</p>
  </div>
</template>

<script>
import mixin from './mixin'
import FormTextView from './detail/FormTextView'

export default {
  name: 'FormRadioBox',
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
      radio: null
    }
  },
  created () {
    // 填充默认值
    if (this.formDefaultValue(this.opt)) {
      const val = this.formDefaultValue(this.opt)

      this.radio = val

      this.choiceChange(val)
    }
  },
  methods: {
    choiceChange (value) {
      // if (this.formReadonly(this.opt)) { return }

      this.$set(this.model, this.opt.code, value)

      const arr = this.opt.props.options.filter(item => item.value + '' === value + '')

      this.$set(this.model, this.opt.code + '_desc', (arr && arr[0] && arr[0].label) || '')
    }
  }
}
</script>

<style lang="scss" scoped>
  ::v-deep .cell-block {
    display: block;
    .van-field__error-message {
      margin-top: 5px;
      opacity: .6;
    }
    .van-radio-group {
      width: 100%;
    }
    .choice {
      width: 100%;margin-top: 12px;
    }
  }
</style>
