<template>
  <div style="text-align: left;">
    <van-field
      v-model="model[opt.code]"
      clickable
      class="fw-field bdn"
      input-align="right"
      :name="opt.code"
      :label="formLabel(opt)"
      :disabled="formReadonly(opt)"
      :placeholder="formLabel(opt, '请输入')"
      :required="formRequired(opt)"
      :rules="formRules(opt, '请输入')"
      @input="handleInput"
    >
    </van-field>
  </div>
</template>

<script>
import mixin from './mixin'

export default {
  name: 'FwInput',
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
  },
  methods: {
    handleInput (val) {
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
  }
</style>
