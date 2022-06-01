<template>
  <FormTextView v-if="formReadonly(opt)" :model="model" :opt="opt" />
  <div v-else>
    <van-field
      v-model="sel"
      clickable
      name="sel"
      input-align="right"
      class="fw-field pr"
      :label="formLabel(opt)"
      :readonly="formReadonly(opt)"
      :placeholder="formLabel(opt, '请选择')"
      :required="formRequired(opt)"
      :rules="formRules(opt, '请选择', true)"
    >
      <!--展示框-->
      <template #input>
        <input
          v-model="selLabel"
          type="text"
          style="text-align: right;"
          class="van-field__control"
          readonly="readonly"
          :disabled="formReadonly(opt)"
          :placeholder="formLabel(opt, '请选择')"
          @click="popupShow=true"
        />
      </template>

      <!--右侧icon-->
      <template v-if="!formReadonly(opt)" #right-icon>
        <svg-icon icon-class="arrow" style="font-size: 12px;" />
      </template>
    </van-field>

    <!--选择网格弹层-->
    <van-popup v-model="popupShow" class="form-component" :get-container="getBodyContainer" position="bottom">
      <van-picker
        show-toolbar
        :columns="objArray2StringArray(opt.props.options, 'label')"
        @cancel="popupShow=false"
        @confirm="(value, index) => { selectItem(value, index) }"
      >
      </van-picker>
    </van-popup>
  </div>
</template>

<script>
import mixin from './mixin'
import FormTextView from './detail/FormTextView'
import { objArray2StringArray } from 'utils/index'

export default {
  name: 'FormSelect',
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
      sel: null,
      selLabel: '',
      popupShow: false,
      objArray2StringArray
    }
  },
  created () {
    // 填充默认值
    if (this.formDefaultValue(this.opt)) {
      const val = this.formDefaultValue(this.opt)

      const index = this.opt.props.options.findIndex(t => t.value + '' === val + '')

      index > -1 && this.selectItem('', index)
    }
  },
  methods: {
    // 选择
    selectItem (location, index) {
      const item = this.opt.props.options[index] || {}
      this.popupShow = false

      this.selLabel = item.label || ''
      this.sel = item.value || ''

      this.$set(this.model, this.opt.code, this.sel)
      this.$set(this.model, this.opt.code + '_desc', this.selLabel)
    }
  }
}
</script>
