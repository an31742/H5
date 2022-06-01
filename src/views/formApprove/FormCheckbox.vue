<template>
  <FormTextView v-if="formReadonly(opt)" :model="model" :opt="opt" />
  <div v-else>
    <van-field
      v-model="checkbox"
      clickable
      name="checkbox"
      class="bdn cell-block"
      input-align="right"
      :label="formLabel(opt)"
      :readonly="formReadonly(opt)"
      :placeholder="formLabel(opt, '请选择')"
      :required="formRequired(opt)"
      :rules="formRules(opt, '请选择')"
    >
      <template #input>
        <van-checkbox-group
          v-model="model[opt.code]"
          :disabled="formReadonly(opt)"
          direction="vertical"
          :max="formMaxLength(opt)"
          :class="{'over-size': formMaxLength(opt) && model[opt.code] && model[opt.code].length >= formMaxLength(opt)}"
          @change="choiceChange"
        >
          <div v-for="(item, index) in opt.props.options" :key="index" class="choice">
            <van-checkbox
              :name="item.value"
              icon-size="0.4533rem"
              checked-color="#E1AA6C"
              shape="square"
            >{{ item.label }}
            </van-checkbox>
          </div>
        </van-checkbox-group>
      </template>
    </van-field>
    <p v-if="formExtra(opt)" class="form-tips">{{ formExtra(opt) }}</p>
  </div>
</template>

<script>
import mixin from './mixin'
import FormTextView from './detail/FormTextView'

export default {
  name: 'FormCheckbox',
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
      checkbox: null
    }
  },
  created () {
    // 填充默认值
    if (this.formDefaultValue(this.opt)) {
      const val = this.formDefaultValue(this.opt, [])

      this.checkbox = JSON.stringify(val)

      this.choiceChange(val)
    }
  },
  methods: {
    choiceChange (value) {
      // if (this.formReadonly(this.opt)) { return }

      this.$set(this.model, this.opt.code, value)

      const arr = this.opt.props.options.filter(item => value.indexOf(item.value) > -1)

      this.$set(this.model, this.opt.code + '_desc', arr.map(ite => ite.label).join('，') || '')
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
    .van-checkbox-group {
      width: 100%;
    }
    .van-checkbox-group .van-icon {
      border-color: #EAC9A5;
    }
    .checkbox-column {
      .van-checkbox {
        padding: 12px 16px;
        box-sizing: border-box;
        border-bottom: 1px solid #F5F5F5;
        &:last-child {
          border-bottom: 0;
        }
      }
    }
    .choice {
      width: 100%;margin-top: 12px;
    }
    .over-size {
      .van-icon {
        background: #eee;
        border-color: #ddd;
      }
    }
  }
</style>
