<template>
  <div>
    <van-field
      v-model="score"
      clickable
      name="score"
      class="fw-field bdn value-fixed"
      input-align="right"
      :label="formLabel(opt)"
      :readonly="formReadonly(opt)"
      :placeholder="formLabel(opt, '请选择')"
      :required="formRequired(opt)"
      :rules="formRules(opt, '请选择')"
    >
      <template #input>
        <van-radio-group v-model="score" direction="horizontal" @change="choiceChange">
          <van-radio name="1" icon-size="0.4533rem" checked-color="#E1AA6C">是</van-radio>
          <van-radio name="2" icon-size="0.4533rem" checked-color="#E1AA6C">否</van-radio>
        </van-radio-group>
      </template>
    </van-field>
  </div>
</template>

<script>
import mixin from './mixin'

export default {
  name: 'FwJudge',
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
      score: this.model[this.opt.code]
    }
  },
  methods: {
    choiceChange (value) {
      if (this.formReadonly(this.opt)) {
        return
      }

      this.$set(this.model, this.opt.code, +value)
      this.$set(this.model, this.opt.code + '_desc', +value === 1 ? '是' : '否')
    }
  }
}
</script>

<style lang="scss" scoped>
  ::v-deep .value-fixed {
    .van-field__label { flex: 1; }
    .van-field__value {
      width: 110px;
      flex: unset;
      text-align: right;
    }
    &.van-field--error {
      .van-radio__label {
        color: red;
      }
    }
  }
</style>
